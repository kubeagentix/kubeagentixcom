---
sidebar_position: 3
---

# Subscription System

The Subscription System handles Stripe integration, credit-based AI metering, tier management, and regional pricing.

## Tier Architecture

### Internal Tier IDs

```typescript
type TrialTier = 'free' | 'trial' | 'pro' | 'pro_plus' | 'ltd' | 'enterprise';
```

### Tier Hierarchy

The tiers have a strict hierarchy for feature gating:

```
free < trial < pro < pro_plus < ltd < enterprise
```

### Tier Definitions

| Internal ID | Display Name | Price | Clusters | AI Mode | Credits |
|-------------|--------------|-------|----------|---------|---------|
| `free` | Free | $0 | 1 | None | None |
| `trial` | Pro Trial | Free (14 days) | 1 | BYOK | None |
| `pro` | Pro | $19/mo | Unlimited | BYOK | None |
| `pro_plus` | Pro Plus | $29/mo | Unlimited | Managed + BYOK | 100/mo |
| `ltd` | Lifetime | $99 one-time | Unlimited | BYOK | None |
| `enterprise` | Enterprise | Custom | Unlimited | Managed + BYOK | Custom |

### Tier Feature Access

```typescript
// lib/pricing/tiers.ts
export const TIER_FEATURES = {
  free: {
    clusters: 1,
    packs: ['kubernetes-core', 'monitoring-prometheus', 'logging-loki'],
    aiEnabled: false,
    cloudSync: false,
  },
  trial: {
    clusters: 1,  // Limited for evaluation
    packs: 'all',
    aiEnabled: true,  // BYOK only
    cloudSync: false,
    duration: 14,  // days
  },
  pro: {
    clusters: Infinity,
    packs: 'all',
    aiEnabled: true,  // BYOK only
    cloudSync: true,
  },
  pro_plus: {
    clusters: Infinity,
    packs: 'all',
    aiEnabled: true,  // Managed + BYOK
    cloudSync: true,
    monthlyCredits: 100,
  },
  ltd: {
    clusters: Infinity,
    packs: 'all',
    aiEnabled: true,  // BYOK only
    cloudSync: true,
  },
  enterprise: {
    clusters: Infinity,
    packs: 'all',
    aiEnabled: true,
    cloudSync: true,
    sso: true,
    customCredits: true,
  },
};
```

### Tier Checking Utility

```typescript
// lib/pricing/enforcement.ts
export function hasTierAccess(current: TrialTier, required: TrialTier): boolean {
  const tierOrder: TrialTier[] = ['free', 'trial', 'pro', 'pro_plus', 'ltd', 'enterprise'];
  return tierOrder.indexOf(current) >= tierOrder.indexOf(required);
}

// Usage
if (hasTierAccess(user.tier, 'pro')) {
  // User has Pro or higher access
}
```

## Trial System

### Auto-Start (Local Tracking)

Pro Trial starts automatically on first launch without sign-up:

```typescript
// stores/trialStore.ts
interface LocalTrialState {
  trialStartDate: string | null;  // ISO date
  trialEndDate: string | null;
  currentTier: TrialTier;
  deviceFingerprint: string;
  machineId: string;
  integrityHash: string;  // HMAC for anti-tampering
}
```

### Trial Integrity

Trial data is protected with HMAC to prevent tampering:

```typescript
// lib/trial/integrity.ts
interface SecureTrialData {
  data: {
    startDate: string;
    endDate: string;
    deviceFingerprint: string;
    tier: string;
  };
  signature: string;  // HMAC-SHA256
}

function createSecureTrialData(data): SecureTrialData;
function verifyTrialIntegrity(secureData): boolean;
```

## Stripe Integration

### Checkout Flow

```
User clicks "Subscribe"
        │
        ▼
POST /api/v1/subscription/checkout
        │
        ▼
Create Stripe Checkout Session
   mode: "subscription" (recurring)
   mode: "payment" (LTD one-time)
        │
        ▼
Redirect to Stripe Checkout
        │
        ▼
Stripe Webhook: checkout.session.completed
        │
        ├── subscription → subscriptionService.handleCheckout()
        └── lifetime_deal → lifetimeDealService.handlePurchaseCompleted()
```

### Webhook Handler

```typescript
// main.ts webhook handler
case 'checkout.session.completed': {
  const session = event.data.object;
  const checkoutType = session.metadata?.type;
  const userId = session.metadata?.user_id;

  // Handle Lifetime Deal (one-time)
  if (checkoutType === 'lifetime_deal' && userId) {
    const result = await lifetimeDealService.handlePurchaseCompleted(
      session.id,
      session.payment_intent
    );
    console.log(`LTD purchase: ${result.success}`);
    break;
  }

  // Handle Subscription (recurring)
  if (userId) {
    await subscriptionService.handleCheckoutCompleted(session.id, userId);
  }
  break;
}
```

## Credit System

### How Credits Work

1. Pro Plus users receive 100 credits/month
2. AI requests consume credits based on token usage
3. When credits exhausted, users can:
   - Purchase additional credits (top-up)
   - Switch to BYOK mode
   - Wait for next billing cycle

### Credit Pricing (Based on Gemini 2.5 Flash)

| Plan | Monthly Price | Credits Included |
|------|---------------|------------------|
| Free | $0 | None |
| Pro Trial | Free | None (BYOK) |
| Pro | $19/mo | None (BYOK) |
| Pro Plus | $29/mo | 100 credits |
| Lifetime | $99 one-time | None (BYOK) |
| Enterprise | Custom | Custom |

### Credit Consumption

```typescript
// Estimate credits for AI request
function estimateCredits(request: AIRequest): number {
  const inputTokens = estimateTokens(request.prompt);
  const outputTokens = estimateTokens(request.maxTokens);

  // Based on Gemini 2.5 Flash pricing
  const inputCost = inputTokens * 0.000001;  // $0.001/1K tokens
  const outputCost = outputTokens * 0.000003; // $0.003/1K tokens

  return inputCost + outputCost;
}
```

## Regional Pricing

### Price Configuration

```typescript
const REGIONAL_PRICING = {
  USD: {
    pro: 1900,          // $19.00
    pro_plus: 2900,     // $29.00
    lifetime: 9900,     // $99.00
    currency: 'usd',
  },
  INR: {
    pro: 159900,        // ₹1,599
    pro_plus: 249900,   // ₹2,499
    lifetime: 849900,   // ₹8,499
    currency: 'inr',
  },
};
```

### Region Detection

```typescript
// Detect region from request
const region = request.headers.get('x-region')
  || request.headers.get('cf-ipcountry')
  || 'US';

const regionCode = (region === 'IN' || region === 'INR')
  ? 'INR'
  : 'USD';
```

## API Endpoints

### Subscription Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/subscription/plans` | GET | List available plans |
| `/api/v1/subscription/checkout` | POST | Create checkout session |
| `/api/v1/subscription/portal` | POST | Create customer portal |
| `/api/v1/subscription/status` | GET | Get subscription status |
| `/api/v1/subscription/cancel` | POST | Cancel subscription |

### LTD Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/subscription/ltd` | GET | Get LTD deal info |
| `/api/v1/subscription/ltd/checkout` | POST | Create LTD checkout |
| `/api/v1/subscription/ltd/status` | GET | Check purchase status |
| `/api/v1/subscription/ltd/owned` | GET | Check if user owns LTD |

### Credit Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/credits/balance` | GET | Get credit balance |
| `/api/v1/credits/usage` | GET | Get usage history |
| `/api/v1/credits/topup` | POST | Purchase additional credits |

## Database Schema

### subscriptions Table

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_customer_id VARCHAR(255) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_id VARCHAR(50) NOT NULL,  -- 'pro', 'pro_plus', 'enterprise'
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### lifetime_deals Table

```sql
CREATE TABLE lifetime_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    purchase_date TIMESTAMPTZ NOT NULL,
    device_fingerprints TEXT[],  -- Can link multiple devices
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### credit_balances Table

```sql
CREATE TABLE credit_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    balance_cents INTEGER NOT NULL DEFAULT 0,
    total_purchased_cents INTEGER DEFAULT 0,
    total_used_cents INTEGER DEFAULT 0,
    last_topup_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT credit_balances_user_unique UNIQUE (user_id)
);
```

### credit_transactions Table

```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL,  -- 'allocation', 'usage', 'topup', 'refund'
    amount_cents INTEGER NOT NULL,
    balance_after_cents INTEGER NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Stripe Webhook Events

| Event | Handler |
|-------|---------|
| `checkout.session.completed` | Process new subscription/LTD |
| `customer.subscription.updated` | Update subscription status |
| `customer.subscription.deleted` | Handle cancellation |
| `invoice.payment_succeeded` | Allocate monthly credits |
| `invoice.payment_failed` | Handle failed payment |

## Implementation Files

### Desktop App (Frontend)

| File | Description |
|------|-------------|
| `stores/trialStore.ts` | Local trial tracking |
| `stores/subscriptionStore.ts` | Subscription state |
| `stores/cloudStore.ts` | Cloud authentication and user tier |
| `lib/pricing/tiers.ts` | Tier definitions |
| `lib/pricing/enforcement.ts` | Feature gating |
| `lib/trial/integrity.ts` | Trial anti-tampering |

### Server (Backend)

| File | Description |
|------|-------------|
| `services/subscription/subscription.service.ts` | Core subscription logic |
| `services/subscription/lifetime.service.ts` | LTD purchase flow |
| `services/subscription/credit.service.ts` | Credit management |
| `services/ai/metering.service.ts` | AI usage metering |
| `lib/pricing.ts` | Regional pricing config |
| `main.ts` | Webhook handler, API routes |

## Testing

### Stripe Test Mode

```bash
# Use test keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Test cards
4242424242424242  # Success
4000000000000002  # Decline
```

### Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local
stripe listen --forward-to localhost:3000/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### Tier Simulation (Dev Mode)

In development, use the DevTierSwitcher component:

```typescript
// Only visible in development
<DevTierSwitcher />
```

This allows testing all tier states without actual purchases.
