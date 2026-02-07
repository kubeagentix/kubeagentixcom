---
sidebar_position: 2
---

# License System

The License System provides offline-capable license validation for KubeAgentics editions using RS256 JWT tokens.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   LICENSE SYSTEM ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Desktop App              API Server              Stripe        │
│   ───────────              ──────────              ──────        │
│                                                                  │
│   ┌───────────────┐       ┌─────────────┐      ┌──────────┐    │
│   │ License Store │◄─────►│ /api/v1/    │      │ Checkout │    │
│   │ (OS Keychain) │       │ license/*   │      │ Sessions │    │
│   └───────┬───────┘       └──────┬──────┘      └─────┬────┘    │
│           │                      │                   │          │
│           ▼                      ▼                   │          │
│   ┌───────────────┐       ┌─────────────┐           │          │
│   │Token Validator│       │ License     │◄──────────┘          │
│   │(RS256 Verify) │       │ Service     │   webhook            │
│   └───────┬───────┘       └──────┬──────┘                      │
│           │                      │                              │
│           ▼                      ▼                              │
│   ┌───────────────┐       ┌─────────────┐                      │
│   │ Pack Gating   │       │ PostgreSQL  │                      │
│   │ Enforcement   │       │ Database    │                      │
│   └───────────────┘       └─────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Product Editions

| Feature | CE (Free) | LTD ($99/₹4999) | Subscription |
|---------|-----------|-----------------|--------------|
| AI Provider | BYOK Only | BYOK Only | Credits + BYOK |
| Clusters | 1 | 5 | 5-Unlimited |
| Packs | K8s + Prometheus | All Standard + Cloud | All + Premium |
| License Expiry | Never | Never | 30-day refresh |
| Offline Grace | Unlimited | Unlimited | 7 days |

## License Token (JWT)

### Token Structure

```typescript
interface LicenseClaims {
  // Standard JWT Claims
  iss: string;              // 'kubeagentics'
  sub: string;              // User ID
  aud: string;              // 'kubeagentics-desktop'
  iat: number;              // Issued at
  exp: number;              // Expiry
  jti: string;              // Unique token ID

  // License Claims
  email: string;
  edition: 'ce' | 'ltd' | 'pro' | 'team' | 'enterprise';
  tier: string;
  licenseType: 'ce' | 'ltd' | 'subscription';

  // Entitlements
  maxClusters: number;
  maxWorkspaces: number;
  allowedPacks: string[];
  aiMode: 'byok' | 'credits' | 'hybrid';
  byokEnabled: boolean;
  aiCreditsEnabled: boolean;

  // Offline Support
  gracePeriodDays: number;
  offlineUntil: number;
}
```

### Token Generation

```typescript
// lib/license/token.ts
export async function generateLicenseToken(
  userId: string,
  claims: Partial<LicenseClaims>,
  privateKey: CryptoKey
): Promise<string> {
  const payload: LicenseClaims = {
    iss: 'kubeagentics',
    sub: userId,
    aud: 'kubeagentics-desktop',
    iat: Math.floor(Date.now() / 1000),
    exp: claims.licenseType === 'ltd'
      ? Math.floor(Date.now() / 1000) + (100 * 365 * 24 * 3600)  // 100 years
      : Math.floor(Date.now() / 1000) + (30 * 24 * 3600),        // 30 days
    jti: crypto.randomUUID(),
    // ... other claims
  };

  return await signJWT(payload, privateKey, 'RS256');
}
```

### Token Validation

```typescript
export async function validateLicenseToken(
  token: string,
  publicKey: CryptoKey
): Promise<LicenseValidationResult> {
  const payload = await verifyJWT(token, publicKey, 'RS256');
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    // Check grace period
    if (payload.offlineUntil > now) {
      return {
        valid: true,
        status: 'grace_period',
        claims: payload,
        daysRemaining: Math.ceil((payload.offlineUntil - now) / 86400),
      };
    }
    return { valid: false, status: 'expired' };
  }

  return { valid: true, status: 'valid', claims: payload };
}
```

## Lifetime Deal System

### Overview

The LTD system handles one-time purchases with:
- **Cap Tracking**: First 1,000 users only
- **Regional Pricing**: USD $99 / INR ₹4,999
- **Atomic Transactions**: Prevents overselling
- **Automatic License Issuance**: On webhook completion

### Purchase Flow

```
1. User clicks "Buy Lifetime Deal"
        │
        ▼
2. POST /api/v1/subscription/ltd/checkout
   - Check deal availability (cap, dates)
   - Check user hasn't already purchased
   - Create Stripe checkout (mode: "payment")
        │
        ▼
3. User completes Stripe payment
        │
        ▼
4. Webhook: checkout.session.completed
   - Detect LTD via metadata.type === "lifetime_deal"
   - Call lifetimeDealService.handlePurchaseCompleted()
        │
        ▼
5. handlePurchaseCompleted():
   a) Verify session not already processed
   b) Fetch session from Stripe API
   c) Verify payment_status === "paid"
   d) Atomic: INCREMENT sold count
   e) Check sold <= cap
   f) Record purchase in ltd_purchases
   g) Create license in licenses table
   h) Update user tier to 'ltd'
        │
        ▼
6. User redirected to success page
```

### Regional Pricing

```typescript
const REGIONAL_PRICING = {
  USD: {
    lifetime: 9900,      // $99.00 (cents)
    currency: 'usd',
  },
  INR: {
    lifetime: 499900,    // ₹4,999 (paise)
    currency: 'inr',
  },
};
```

### Cap Tracking (Atomic)

```sql
-- Atomic increment with row locking
UPDATE lifetime_deals
SET sold = COALESCE(sold, 0) + 1,
    updated_at = NOW()
WHERE deal_code = $1
  AND is_active = true
RETURNING sold;
```

## API Endpoints

### License Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/license/issue` | POST | Admin | Issue new license token |
| `/api/v1/license/refresh` | POST | User | Refresh license token |
| `/api/v1/license/validate` | POST | Public | Validate token |
| `/api/v1/license/public-key` | GET | Public | Get RS256 public key |

### LTD Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/v1/subscription/ltd` | GET | Public | Get deal info |
| `/api/v1/subscription/ltd/checkout` | POST | User | Create checkout |
| `/api/v1/subscription/ltd/status` | GET | User | Check status |
| `/api/v1/subscription/ltd/owned` | GET | User | Check ownership |

## Pack Gating

### Pack Access Matrix

```typescript
const PACK_ACCESS = {
  ce: ['kubernetes', 'prometheus'],
  ltd: [
    'kubernetes', 'prometheus', 'logging', 'alerting',
    'gitops', 'tracing', 'cloud-aws', 'cloud-gcp', 'cloud-azure'
  ],
  pro: [
    'kubernetes', 'prometheus', 'logging', 'alerting',
    'gitops', 'tracing', 'cloud-aws', 'cloud-gcp', 'cloud-azure'
  ],
  team: [
    'kubernetes', 'prometheus', 'logging', 'alerting',
    'gitops', 'tracing', 'cloud-aws', 'cloud-gcp', 'cloud-azure',
    'security', 'cost-analysis'
  ],
  enterprise: ['*'],  // All packs
};
```

### Enforcement Points

1. **Desktop App**: Filter pack list, show lock badges
2. **API Server**: Validate on pack install requests
3. **License Token**: `allowedPacks` array for offline enforcement

## Offline Validation

### Validation Flow

```
App Starts
    │
    ▼
Load Cached License Token
    │
    ▼
Verify RS256 Signature (local public key)
    │
    ├── Invalid → Online? → Fetch New Token
    │                  └── No → Show "Connect to Activate"
    ▼
Check Expiry
    │
    ├── Valid → FULL ACCESS
    │
    └── Expired → Check Grace Period
                      │
                      ├── Within Grace → DEGRADED ACCESS
                      │   (Read-only, no AI credits, BYOK works)
                      │
                      └── Past Grace → LOCKED
                          (Must connect to renew)
```

### Grace Period Behavior

| Edition | License Validity | Grace Period | Offline Limit |
|---------|------------------|--------------|---------------|
| CE | Never expires | N/A | Unlimited |
| LTD | Never expires | N/A | Unlimited |
| Subscription | 30 days | 7 days degraded | 37 days total |

## Database Schema

### licenses Table

```sql
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_key VARCHAR(100) NOT NULL UNIQUE,
    license_type VARCHAR(20) NOT NULL DEFAULT 'ce',
    edition VARCHAR(20) NOT NULL DEFAULT 'ce',
    ai_mode VARCHAR(20) NOT NULL DEFAULT 'byok',
    max_clusters INTEGER NOT NULL DEFAULT 1,
    max_workspaces INTEGER NOT NULL DEFAULT 1,
    allowed_packs TEXT[] DEFAULT ARRAY['kubernetes', 'prometheus'],
    features JSONB DEFAULT '{}',
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ,  -- NULL for LTD (never expires)
    grace_period_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### ltd_purchases Table

```sql
CREATE TABLE ltd_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES lifetime_deals(id),
    user_id UUID NOT NULL REFERENCES users(id),
    purchase_price INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    stripe_payment_id VARCHAR(255) NOT NULL,
    stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(10) NOT NULL DEFAULT 'US',
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ltd_purchases_one_per_user UNIQUE (user_id)
);
```

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| 2000 | LTD_NOT_AVAILABLE | No active lifetime deal |
| 2001 | LTD_SOLD_OUT | Deal cap reached |
| 2002 | LTD_NOT_STARTED | Deal hasn't started yet |
| 2003 | LTD_EXPIRED | Deal has ended |
| 2004 | LTD_ALREADY_PURCHASED | User already owns LTD |

## Implementation Files

| File | Description |
|------|-------------|
| `lib/license/token.ts` | RS256 JWT generation and validation |
| `services/subscription/lifetime.service.ts` | LTD purchase flow |
| `db/repositories/lifetime-deal.repository.ts` | Database operations |
| `db/migrations/012_license_system.sql` | License tables |
| `db/migrations/013_ltd_purchases.sql` | LTD purchases |
| `main.ts:1563-1700` | LTD API routes |
| `main.ts:672-700` | Webhook handler |
