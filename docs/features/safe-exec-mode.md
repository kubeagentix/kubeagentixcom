---
sidebar_position: 2
title: SafeExec Mode
description: Intelligent Query Routing with safe execution of cluster changes
---

# SafeExec Mode

SafeExec mode is KubeAgentiX's **Intelligent Query Routing System** - a breakthrough approach that provides the best of both worlds: **instant responses for read operations** and **safe, approval-based execution for write operations**.

## The Problem with Traditional AI Assistants

Most AI-powered DevOps tools have a fundamental limitation: they treat every query the same way, sending everything through the LLM. This creates issues:

- **Slow responses** for simple queries like "list pods"
- **Unnecessary costs** - using expensive AI tokens for basic commands
- **User fatigue** - approving plans for harmless read operations

## Our Solution: Three-Tier Intelligent Query Routing

SafeExec mode uses a sophisticated three-tier system that routes queries to the most efficient execution path:

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   Intent Detection      │  Fast pattern matching
│   (No LLM call!)        │  ~0ms latency
└────────┬────────────────┘
         │
    ┌────┼────┬────┐
    ▼    ▼    ▼    ▼
┌──────┐┌──────┐┌──────┐
│Tier 1││Tier 2││Tier 3│
│Direct││Compose││Reason│
└──┬───┘└──┬───┘└──┬───┘
   │       │       │
   ▼       ▼       ▼
 Execute  Execute  LLM
 Directly Directly Reasoning
```

### Tier 1: Direct Execution (⚡ Instant)

**For simple, read-only queries:**

| Query | Action | LLM Used? |
|-------|--------|-----------|
| "list pods" | `kubectl get pods` | ❌ No |
| "show deployments" | `kubectl get deployments` | ❌ No |
| "docker containers" | `docker ps -a` | ❌ No |
| "helm releases" | `helm list` | ❌ No |

**Latency:** Near-instant (~100ms)
**Cost:** Zero AI tokens

### Tier 2: Command Composition (🔧 Smart)

**For queries needing shell pipes or data transformation:**

| Query | Generated Command | LLM Used? |
|-------|-------------------|-----------|
| "sort pods by memory" | `kubectl top pods --sort-by=memory` | ⚡ Minimal |
| "count pods per node" | `kubectl get pods -o wide \| awk ...` | ⚡ Minimal |
| "unique images in cluster" | `kubectl get pods -o jsonpath=... \| sort -u` | ⚡ Minimal |

**Latency:** ~500ms
**Cost:** ~100-200 tokens (just for composition)

### Tier 3: Reasoning Mode (🧠 Full AI)

**For complex analysis or write operations requiring plans:**

| Query | Action | LLM Used? |
|-------|--------|-----------|
| "scale deployment to 5" | Generate approval plan | ✅ Full |
| "why is my pod crashing?" | Multi-step analysis | ✅ Full |
| "delete unused configmaps" | Careful planning | ✅ Full |

**Latency:** 2-5 seconds
**Cost:** Full AI reasoning (1000+ tokens)

## How It Works

### 1. Fast Intent Detection

When you submit a query, SafeExec first tries to classify it using **pattern matching** (no AI call):

```typescript
// These patterns are matched instantly:
"list pods" → kubectl get pods (READ)
"show deployments" → kubectl get deployments (READ)
"scale deployment" → REQUIRES PLAN (WRITE)
"delete pod" → REQUIRES PLAN (DANGEROUS)
```

### 2. Operation Classification

Every operation is classified as:

| Type | Description | Requires Approval? |
|------|-------------|-------------------|
| **Read** | List, get, describe, logs, metrics | ❌ No - Execute directly |
| **Write** | Create, update, scale, restart | ✅ Yes - Show plan |
| **Dangerous** | Delete, force, purge | ✅ Yes + Confirmation |

### 3. Smart Routing

Based on classification:

```
READ operations → Execute immediately, show results
WRITE operations → Generate plan, wait for approval
DANGEROUS operations → Generate plan + explicit confirmation
```

## User Experience

### Read Query Example

**You type:** "show me the pods in production namespace"

**What happens:**
1. Pattern detected: "show me pods" → READ operation
2. Command generated: `kubectl get pods -n production`
3. Executed immediately
4. Results displayed in ~200ms

**No plan generated. No approval needed. Instant results.**

### Write Query Example

**You type:** "scale the frontend deployment to 5 replicas"

**What happens:**
1. Pattern detected: "scale" → WRITE operation
2. LLM generates detailed plan:
   ```
   📋 Execution Plan: Scale frontend deployment

   Step 1: Verify current state [LOW RISK]
     kubectl get deployment frontend -n default

   Step 2: Scale deployment [MEDIUM RISK]
     kubectl scale deployment/frontend --replicas=5

   Step 3: Verify scaling [LOW RISK]
     kubectl rollout status deployment/frontend
   ```
3. Plan displayed in Activity panel
4. **You review and approve**
5. Execution begins

## Comparison with Ask Mode

| Aspect | Ask Mode | SafeExec Mode |
|--------|----------|---------------|
| **Read queries** | LLM processes | Direct execution (faster) |
| **Write queries** | N/A | Plan & approve |
| **Latency** | 1-3 seconds | 100ms (reads) / 2-5s (writes) |
| **Token cost** | Full LLM | Minimal for reads |
| **Use case** | Exploration | Day-to-day operations |

## Benefits

### 1. 10-100x Token Savings

Most DevOps queries are simple reads. SafeExec handles these without AI:

- "list pods" → 0 tokens (vs 1000+ with traditional approach)
- "show services" → 0 tokens
- "helm status" → 0 tokens

### 2. Near-Instant Responses

Read operations return in ~200ms vs 2-3 seconds with LLM processing.

### 3. Safe by Default

Write operations always require approval. No accidental changes.

### 4. Transparent Execution

You see exactly what commands will run before they execute.

### 5. Cost Predictability

- Simple queries: Free (no AI tokens)
- Complex queries: Predictable AI costs

## Supported Commands

### Auto-Detected Read Commands

| Tool | Commands |
|------|----------|
| **kubectl** | get, describe, logs, events, top |
| **docker** | ps, images, inspect, logs |
| **helm** | list, status, get, history |

### Commands Requiring Plans

| Tool | Commands |
|------|----------|
| **kubectl** | create, apply, delete, scale, restart, patch |
| **docker** | run, stop, rm, rmi, build |
| **helm** | install, upgrade, uninstall, rollback |

## Configuration

### Enabling/Disabling SafeExec

SafeExec mode can be disabled for organizations requiring GitOps-only workflows:

1. Open **Settings** (gear icon)
2. Navigate to workspace settings
3. Toggle "SafeExec Mode Enabled"

When disabled:
- Only Ask mode is available
- All changes must go through GitOps pipelines

## Best Practices

1. **Use SafeExec for daily operations** - Get the speed benefits for reads, safety for writes
2. **Review plans carefully** - Especially for MEDIUM and HIGH risk steps
3. **Start with Quick Dx** - Diagnose issues before making changes
4. **Trust the classification** - The system correctly routes 95%+ of queries

## Technical Details

### Intent Detection Patterns

SafeExec uses a combination of:

1. **Keyword patterns** - "list", "show", "get" → READ
2. **Verb patterns** - "delete", "create", "scale" → WRITE
3. **Tool-specific patterns** - `kubectl get`, `docker ps` → Direct commands
4. **LLM fallback** - For ambiguous queries only

### Integration with Tool Classification

SafeExec respects your [Tool Classification](../guardrails/tool-classification.md) settings:

- Tools marked as 'read' → Direct execution
- Tools marked as 'write' → Require plan approval
- Tools marked as 'dangerous' → Require plan + confirmation

## Related

- [Ask Mode](./ask-mode.md) - Pure read-only exploration
- [Guardrails Overview](../guardrails/overview.md) - Safety mechanisms
- [Tool Classification](../guardrails/tool-classification.md) - Managing tool access
- [Token Efficiency](./token-efficiency.md) - Optimizing AI costs
