---
sidebar_position: 1
title: Ask Mode
description: Read-only AI queries for safe cluster exploration
---

# Ask Mode

Ask mode is the **default read-only mode** for interacting with your Kubernetes cluster through AI. It provides a safe way to explore, query, and understand your cluster without making any changes.

## Overview

In Ask mode, the AI assistant can only execute **read-only operations**. This means you can freely ask questions about your cluster's state, get diagnostic information, and explore resources without worrying about accidental modifications.

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Read-only** | Only get, describe, list, and log operations allowed |
| **Safe exploration** | No risk of accidental changes to your cluster |
| **Default mode** | Automatically selected when you open the Agentic Panel |
| **Tool filtering** | Write operations are automatically blocked |

## What You Can Do

### Cluster Exploration

```
"What pods are running in the default namespace?"
"Show me the deployment configuration for nginx"
"List all services across all namespaces"
```

### Diagnostics

```
"Why is pod vote-abc123 in CrashLoopBackOff?"
"Show me the logs for the failing container"
"What events occurred in the last hour?"
```

### Resource Analysis

```
"Describe the vote deployment"
"What's the resource usage for nodes?"
"Show me the ingress configuration"
```

### Metrics & Monitoring

```
"What's the CPU usage for the frontend pods?"
"Show me memory trends for the last hour"
"Query Prometheus for error rates"
```

## What's Blocked

In Ask mode, the following operations are **automatically blocked**:

- Creating resources (`kubectl apply`, `kubectl create`)
- Updating resources (`kubectl patch`, `kubectl edit`)
- Scaling deployments (`kubectl scale`)
- Deleting resources (`kubectl delete`)
- Restarting pods (`kubectl rollout restart`)
- Any MCP tool classified as 'write' or 'dangerous'
- Any CLI tool command classified as 'write' or 'dangerous'

When you attempt a write operation in Ask mode, the AI will explain that the operation requires **Plan mode** and suggest switching.

### CLI Tool Commands

Local CLI tools (Docker, Helm, etc.) use **command-level classification**. This means some commands from the same tool are allowed in Ask mode while others are blocked:

| Tool | Allowed in Ask | Blocked in Ask |
|------|----------------|----------------|
| docker | `ps`, `images`, `logs` | `build`, `rm`, `prune` |
| helm | `list`, `status` | `install`, `uninstall` |
| terraform | `show`, `output` | `apply`, `destroy` |

See [Command-Level Safety](../guardrails/command-safety.md) for details.

## Blocked Tools Warning

When tools are blocked in Ask mode, you'll see a warning banner at the top of the chat:

```
⚠️ 12 tools blocked in Ask mode (8 write, 4 dangerous)
```

Click the banner to expand and see which tools are blocked, or click the settings icon to manage tool classifications.

## When to Use Ask Mode

| Use Case | Recommended |
|----------|-------------|
| Learning about cluster state | ✅ Ask Mode |
| Debugging issues | ✅ Ask Mode |
| Viewing logs and events | ✅ Ask Mode |
| Making changes to resources | ❌ Use Plan Mode |
| Scaling deployments | ❌ Use Plan Mode |
| Deleting resources | ❌ Use Plan Mode |

## Switching to Plan Mode

When you need to make changes, switch to Plan mode using:

1. **Tab bar**: Click the "Plan" tab in the Agentic Panel header
2. **Mode dropdown**: Click the mode selector at the bottom of the input area

See [Plan & Approve Mode](./plan-mode.md) for details on making changes safely.

## Configuration

### Disabling Plan Mode

Organizations that require GitOps-only changes can disable Plan mode entirely:

```typescript
// In workspace settings
setPlanModeEnabled(false);
```

When disabled, the Plan tab is hidden and users can only use Ask mode for read-only queries.

### Tool Classification

Administrators can customize which tools are allowed in Ask mode through the **Tool Access** settings:

1. Go to **Settings > Tool Access**
2. View all available tools with their classifications
3. Override auto-classification if needed

See [Tool Classification](../guardrails/tool-classification.md) for details.

## Best Practices

1. **Start in Ask mode** - Always begin troubleshooting by gathering information
2. **Use context** - Add resources to context for more accurate responses
3. **Ask follow-up questions** - Drill down into specific issues
4. **Switch to Plan mode** - Only when you're ready to make changes

## Related

- [Plan & Approve Mode](./plan-mode.md) - For making changes safely
- [Quick Diagnostics](./rca.md) - Automated root cause analysis
- [Tool Classification](../guardrails/tool-classification.md) - Managing tool access
- [Command-Level Safety](../guardrails/command-safety.md) - Per-command classification
- [Local CLI Tools](./local-cli-tools.md) - Desktop CLI tool integration
