---
sidebar_position: 3
---

# Credit System

KubeAgentics uses a credit-based system for AI-powered features. This guide explains how credits work, how they're calculated, and how to monitor your usage.

## How Credits Work

Credits represent the monetary value of AI operations. When you use AI features like Chat, RCA, or Runbook generation, credits are deducted based on the computational cost of the request.

**Key points**:
- 1 credit = $0.01 USD
- Credits are consumed per AI request
- Cost varies by request complexity (token count)
- All AI features use the same credit pool

## Credit Pricing

Credit consumption is calculated based on the **Gemini 2.5 Flash** model pricing:

| Component | Cost per 1M Tokens | Cost per 1K Tokens |
|-----------|-------------------|-------------------|
| Input (prompt) | $0.075 | $0.000075 |
| Output (response) | $0.30 | $0.0003 |

### Example Calculations

**Simple chat query** (500 input tokens, 200 output tokens):
```
Input cost:  500 / 1,000,000 * $0.075 = $0.0000375
Output cost: 200 / 1,000,000 * $0.30  = $0.00006
Total: $0.0000975 (~0.01 credits)
```

**RCA investigation** (5,000 input tokens, 2,000 output tokens):
```
Input cost:  5,000 / 1,000,000 * $0.075 = $0.000375
Output cost: 2,000 / 1,000,000 * $0.30  = $0.0006
Total: $0.000975 (~0.1 credits)
```

**Complex runbook generation** (10,000 input tokens, 8,000 output tokens):
```
Input cost:  10,000 / 1,000,000 * $0.075 = $0.00075
Output cost: 8,000 / 1,000,000 * $0.30   = $0.0024
Total: $0.00315 (~0.32 credits)
```

## Credit Usage by Feature

Different features consume credits at varying rates:

| Feature | Typical Usage | Credits per Operation |
|---------|---------------|----------------------|
| AI Chat (simple) | Quick questions | 0.01 - 0.05 |
| AI Chat (detailed) | In-depth explanations | 0.05 - 0.20 |
| Quick Diagnostics | Cluster health check | 0.10 - 0.30 |
| Root Cause Analysis | Full investigation | 0.20 - 1.00 |
| Runbook Generation | Operational procedures | 0.30 - 0.80 |
| Cost Optimization | Resource recommendations | 0.15 - 0.50 |

**Note**: Actual usage varies based on context size (logs, events, resources being analyzed).

## Monitoring Your Credits

### In-App Credit Display

Your current credit balance is always visible in the app:
- **Status bar**: Shows remaining credits
- **Settings > Subscription**: Detailed usage breakdown
- **Usage history**: View credit consumption over time

### Usage Breakdown

The usage view shows:
- **Total credits used** this billing period
- **Credits by feature**: Which features consumed the most
- **Credits by day**: Daily usage pattern
- **Remaining credits**: Available balance

### Usage Alerts

Configure alerts to stay informed:
- **Low balance warning**: When credits drop below threshold
- **Usage spike**: Unusual consumption patterns
- **Daily summary**: Optional daily usage email

## Purchasing Additional Credits

If you need more credits than your plan includes:

### Credit Packs (USD)

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Small | 500 | $5 | $0.01 |
| Medium | 1,500 | $12 | $0.008 |
| Large | 5,000 | $35 | $0.007 |
| Enterprise | 20,000 | $120 | $0.006 |

### Credit Packs (INR)

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Small | 500 | Rs 450 | Rs 0.90 |
| Medium | 1,500 | Rs 1,050 | Rs 0.70 |
| Large | 5,000 | Rs 3,000 | Rs 0.60 |
| Enterprise | 20,000 | Rs 10,000 | Rs 0.50 |

**Note**: Larger packs offer better value per credit.

## Credit Policies

### Rollover

- **Monthly plans**: Unused credits roll over for up to 2 billing cycles
- **Annual plans**: Credits roll over throughout the subscription year
- **Purchased credits**: Never expire while subscription is active

### On Cancellation

- Credits remain available for 30 days after cancellation
- After 30 days, unused credits are forfeited
- Resubscribing within 30 days restores your credits

### Refunds

- Purchased credit packs are non-refundable
- Included plan credits are part of the subscription refund policy

## Tips for Efficient Credit Usage

### 1. Use Appropriate Context

Only include relevant context in AI requests:
- Select specific resources instead of entire namespaces
- Filter logs to relevant time periods
- Focus queries on specific issues

### 2. Start Simple

Begin with quick diagnostics before full RCA:
- Quick Dx uses fewer credits
- Full RCA only when needed

### 3. Reuse Runbooks

Generated runbooks can be saved and reused:
- Don't regenerate the same runbook
- Customize existing ones instead

### 4. Batch Operations

Combine related questions in single sessions:
- Follow-up questions use conversation context
- More efficient than separate new queries

### 5. Monitor Usage Patterns

Review your usage breakdown regularly:
- Identify high-consumption patterns
- Optimize workflows accordingly

## Lifetime Plan: BYOK Model

The Lifetime Deal uses a Bring Your Own Key (BYOK) model:

- **No credits needed**: You pay AI providers directly
- **Use your own API keys**: Google, OpenAI, Anthropic, or Ollama
- **No usage limits**: Limited only by your provider plan
- **Cost control**: Direct visibility into provider costs

See [Lifetime Deal](/docs/plans/lifetime-deal) for setup instructions.

## Frequently Asked Questions

### Why credits instead of direct pricing?

Credits provide:
- Predictable costs with included amounts
- Simplified billing (one transaction vs. per-request)
- Better value through bulk pricing
- Easy tracking and budgeting

### Can I see token counts?

Yes, the usage detail view shows:
- Input tokens per request
- Output tokens per request
- Total tokens and cost

### What if I run out of credits?

When credits are depleted:
- AI features show a low credit warning
- You can purchase additional credits
- CE features remain fully functional

### Are there rate limits?

To ensure fair usage:
- 100 AI requests per hour per user
- 1,000 AI requests per day per user
- Higher limits available for Team plans

## Next Steps

- [Start Your Trial](/docs/plans/trial) with $3 in credits
- [View Pricing](/docs/plans/pricing) to choose a plan
- [Configure AI](/docs/features/ai-chat) to start using AI features
