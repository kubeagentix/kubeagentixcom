---
sidebar_position: 1
---

# Developer Guide

Welcome to the KubeAgentics internal developer documentation. This section covers implementation details for core systems.

## Architecture Overview

KubeAgentics follows a modern architecture with:

- **Desktop App (Tauri)**: Cross-platform native app with React frontend
- **API Server (Deno)**: REST API with PostgreSQL and Stripe integration
- **License System**: RS256 JWT-based offline-capable licensing
- **Subscription System**: Credits, Stripe billing, regional pricing

## Core Systems

### License System

The [License System](/docs/developer/license-system) handles:
- Product edition management (CE, LTD, Subscription)
- RS256 JWT token generation and validation
- Offline license validation with grace periods
- Pack gating and entitlement enforcement

### Subscription System

The [Subscription System](/docs/developer/subscription-system) handles:
- Stripe integration (checkout, webhooks, customer portal)
- Credit-based AI usage metering
- Regional pricing (USD, INR)
- Lifetime Deal purchases with cap tracking

## Quick References

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# License System
LICENSE_PRIVATE_KEY=<RS256 private key>
LICENSE_PUBLIC_KEY=<RS256 public key>
```

### Key Files

| System | Location |
|--------|----------|
| License Token | `lib/license/token.ts` |
| LTD Service | `services/subscription/lifetime.service.ts` |
| Stripe Webhook | `main.ts:648-765` |
| DB Migrations | `db/migrations/012_*.sql`, `013_*.sql` |

## Development Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Set up environment variables
4. Run migrations: `bun run db:migrate`
5. Start server: `bun run dev`

## Testing

```bash
# Run all tests
bun test

# Run license system tests
bun test --grep "license"

# Run LTD tests
bun test --grep "lifetime"
```
