---
sidebar_position: 1
---

# Plans Overview

KubeAgentiX offers flexible pricing options to fit your Kubernetes management needs, from free usage to full-featured professional plans with AI capabilities.

## Tier Structure

| Tier | Display Name | Price | Clusters | Description |
|------|--------------|-------|----------|-------------|
| `free` | **Free** | $0 | 1 | Basic packs, essential features |
| `trial` | **Pro Trial** | Free (14 days) | 1 | All Pro features for evaluation |
| `pro` | **Pro** | $19/mo | Unlimited | All features, BYOK for AI |
| `pro_plus` | **Pro Plus** | $29/mo | Unlimited | Pro + 100 AI credits/month |
| `ltd` | **Lifetime** | $99 one-time | Unlimited | Pro forever, one payment |
| `enterprise` | **Enterprise** | Custom | Unlimited | Custom solutions, dedicated support |

## Plan Details

### Free

The Free tier provides essential Kubernetes management capabilities:

- **Cluster Management**: Connect to and manage 1 Kubernetes cluster
- **Basic Packs**: Kubernetes Core, Prometheus Monitoring, Loki Logging
- **Resource Browsing**: Navigate namespaces, pods, deployments, services
- **Pod Shell Access**: Interactive shell into containers
- **Port Forwarding**: Create tunnels to access services locally
- **Log Viewing**: Basic log exploration
- **Metrics Dashboard**: View cluster metrics

**Best for**: Individual developers, learning Kubernetes, small projects

---

### Pro Trial

The Pro Trial gives you full access to all Pro features for 14 days:

- **All Pro Features**: Complete access to everything
- **All Packs**: Every pack enabled during trial
- **1 Cluster Limit**: Evaluate on your primary cluster
- **No Credit Card Required**: Start immediately
- **No Sign-up Required**: Trial starts automatically on first launch

**What happens after trial**:
- Reverts to Free tier if not upgraded
- All your configurations remain intact
- Upgrade anytime to restore Pro access

**Best for**: Evaluating KubeAgentiX before purchasing

---

### Pro ($19/month)

The Pro tier unlocks the full power of AI-assisted Kubernetes management:

- **All Free Features** plus:
- **All Packs**: GitOps, Helm, Security, Cost Analysis, and more
- **Unlimited Clusters**: Connect as many clusters as needed
- **AI Features (BYOK)**: Bring your own API keys for AI
  - Natural language chat with your cluster
  - Root Cause Analysis (RCA)
  - Runbook Generation
  - Quick Diagnostics
  - Cost Optimization recommendations
- **Issue Tracking Integration**: Jira, GitHub Issues, Linear
- **Alert Integration**: AlertManager, Grafana
- **Cloud Sync**: Sync settings across devices
- **Priority Support**: Faster response times

**Best for**: DevOps teams, SREs, production Kubernetes environments

---

### Pro Plus ($29/month)

Everything in Pro, plus AI credits included:

- **All Pro Features**
- **100 AI Credits/month**: No API key setup required
- **Managed AI Service**: We handle the AI provider
- **Credit Rollover**: Unused credits roll over (up to 2 months)

**Best for**: Teams who want AI without managing API keys

---

### Lifetime ($99 one-time)

Pro features forever with a single payment:

- **All Pro Features**: Permanently unlocked
- **All Future Pro Features**: Included as we add them
- **BYOK Mode**: Use your own AI provider API keys
- **No Monthly Fees**: One payment, forever access
- **Founding Member Badge**: Recognition for early supporters
- **Priority Feature Requests**: Your feedback prioritized

**Limited availability**: First 1,000 customers only

**Best for**: Long-term users who prefer a one-time investment

---

### Enterprise

Custom solutions for large organizations:

- **Everything in Pro Plus**
- **Custom Integrations**: Tailored to your infrastructure
- **SSO/SAML**: Enterprise authentication
- **Dedicated Support**: SLA-backed response times
- **On-premises Option**: Deploy in your infrastructure
- **Custom Pricing**: Based on your needs

**Best for**: Large organizations with specific requirements

## Feature Comparison

| Feature | Free | Pro Trial | Pro | Pro Plus | Lifetime | Enterprise |
|---------|------|-----------|-----|----------|----------|------------|
| Clusters | 1 | 1 | ∞ | ∞ | ∞ | ∞ |
| Basic Packs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| All Packs | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Chat (BYOK) | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Credits | - | - | - | 100/mo | - | ✅ |
| Root Cause Analysis | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Runbook Generation | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quick Diagnostics | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cost Optimization | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Issue Tracking | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Alert Integration | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cloud Sync | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| Priority Support | - | - | ✅ | ✅ | ✅ | ✅ |
| SSO/SAML | - | - | - | - | - | ✅ |

## User Journey

```
Download App
      ↓
┌─────────────────────────────────────────┐
│  PRO TRIAL AUTO-STARTS (14 days)        │
│  ✓ All Pro features                     │
│  ✓ All packs available                  │
│  ⚠ 1 cluster limit                      │
│  • No sign-up required                  │
└─────────────────────────────────────────┘
      ↓
  Day 14 Expiry
      ↓
┌─────────────────────────────────────────┐
│  Your Pro Trial Has Ended               │
│                                         │
│  Upgrade to unlock unlimited clusters:  │
│  • Pro: $19/mo (unlimited clusters)     │
│  • Pro Plus: $29/mo (+ AI credits)      │
│  • Lifetime: $99 one-time               │
│                                         │
│  Or continue with Free (limited packs,  │
│  1 cluster)                             │
└─────────────────────────────────────────┘
```

## Quick Reference

### Upgrade Value Props

- **Pro Trial → Pro**: "Unlock unlimited clusters and workspaces"
- **Free → Pro**: "Get all packs + unlimited clusters"
- **Pro → Pro Plus**: "Add 100 AI credits/month (skip BYOK setup)"
- **Any → Lifetime**: "5 months of Pro = forever. Best value."

### Internal Tier IDs

For developers, here are the internal tier identifiers:

```typescript
type TrialTier = 'free' | 'trial' | 'pro' | 'pro_plus' | 'ltd' | 'enterprise';
```

## Next Steps

- [View Detailed Pricing](/docs/plans/pricing)
- [Learn About Pro Trial](/docs/plans/trial)
- [Explore the Lifetime Deal](/docs/plans/lifetime-deal)
- [Understand the Credit System](/docs/plans/credits)
