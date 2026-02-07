---
sidebar_position: 2
title: Tool Classification
description: Managing read/write/dangerous tool classifications for AI safety
---

# Tool Classification

The Tool Classification system automatically categorizes AI tools to enforce safety guardrails. Tools are classified as **read**, **write**, or **dangerous**, determining when they can be used.

## Overview

Every tool available to the AI (both built-in and MCP) has a classification:

| Classification | Description | Ask Mode | Plan Mode |
|----------------|-------------|----------|-----------|
| **Read** | Safe, read-only operations | ✅ Allowed | ✅ Allowed |
| **Write** | Mutations requiring approval | ❌ Blocked | ✅ With approval |
| **Dangerous** | Destructive operations | ❌ Blocked | ⚠️ Extra approval |

## Auto-Classification

Tools are automatically classified based on naming patterns:

### Read Patterns (Green - Allowed in Ask mode)

```
get_*       list_*      describe_*    show_*
fetch_*     query_*     read_*        find_*
search_*    check_*     view_*        inspect_*
*_logs      *_events    *_status      *_info
*_metrics   *_details
```

**Examples:**
- `get_pods` → Read
- `list_services` → Read
- `describe_deployment` → Read
- `pod_logs` → Read

### Write Patterns (Yellow - Blocked in Ask mode)

```
create_*    update_*    patch_*       scale_*
restart_*   apply_*     deploy_*      rollout_*
set_*       modify_*    edit_*        add_*
insert_*    post_*      put_*
*_create    *_update    *_apply
```

**Examples:**
- `create_deployment` → Write
- `scale_replicas` → Write
- `update_configmap` → Write
- `apply_manifest` → Write

### Dangerous Patterns (Red - Blocked in Ask mode)

```
delete_*    remove_*    destroy_*     drain_*
cordon_*    uncordon_*  force_*       purge_*
truncate_*
*_delete    *_destroy   *_remove
```

**Examples:**
- `delete_pod` → Dangerous
- `drain_node` → Dangerous
- `destroy_namespace` → Dangerous
- `force_remove` → Dangerous

## MCP Tool Handling

When users add new MCP servers, tools are automatically classified:

### Classification Process

```
MCP Tool: mcp_github_create_issue
         │
         ├── Extract tool name: create_issue
         │
         ├── Check patterns: create_* matches Write
         │
         └── Classification: Write (blocked in Ask mode)
```

### Fail-Safe Default

**Unknown tools default to 'write' classification.** This ensures that new MCP tools with unfamiliar names are safely blocked in Ask mode until an administrator explicitly classifies them as read-only.

```
MCP Tool: mcp_custom_server_do_something
         │
         ├── No pattern match
         │
         └── Default: Write (blocked in Ask mode)
```

## Managing Classifications

### Accessing Tool Access Settings

1. Open **Settings** (gear icon)
2. Click **Tool Access** tab
3. View all tools with their classifications

### Tool Access UI Features

| Feature | Description |
|---------|-------------|
| **Search** | Find tools by name or description |
| **Filter** | Show only read/write/dangerous tools |
| **Group by Server** | MCP tools grouped by server name |
| **Override Badge** | Shows which tools have manual overrides |
| **Statistics** | Total counts per classification |

### Overriding Classification

To change a tool's classification:

1. Find the tool in the list
2. Click the **Edit** button (pencil icon)
3. Select the new classification: Read, Write, or Dangerous
4. The change is saved immediately

Overridden tools show a **lock icon** and "override" badge.

### Resetting to Auto

To reset a tool to auto-classification:

1. Find the overridden tool (shows lock icon)
2. Click the **Unlock** button
3. Classification reverts to auto-detected value

### Clearing All Overrides

To reset all tools to auto-classification:

1. Go to **Settings > Tool Access**
2. Click **Clear Overrides** button
3. All tools revert to auto-classification

## Built-in Tools

KubeAgentics built-in tools have fixed classifications:

| Tool | Classification | Notes |
|------|----------------|-------|
| `kubectl` | Read | Read-only enforced at engine level |
| `prometheus` | Read | Query-only, no modifications |
| `k8s.get_*` | Read | All get operations |
| `k8s.describe_*` | Read | All describe operations |
| `k8s.logs` | Read | Pod log retrieval |

## Local CLI Tools

Local CLI tools (docker, helm, terraform, etc.) use **command-level classification** instead of tool-level. This means each subcommand is classified independently.

### Tool Naming

CLI tools use **direct names** (e.g., `docker`, `argocd`, `helm`) for better LLM comprehension. The AI already knows these tool names, so using direct names improves tool selection accuracy.

:::info Why Direct Names?
LLMs have extensive training on common CLI tools like `docker`, `kubectl`, and `helm`. Using direct names (instead of prefixed names like `cli_docker`) allows the AI to leverage its existing knowledge for better command generation.
:::

### Command Classification Examples

| Tool | Command | Classification |
|------|---------|----------------|
| docker | `ps`, `images`, `logs` | Read |
| docker | `build`, `run`, `pull` | Write |
| docker | `rm`, `rmi`, `prune` | Dangerous |
| kubectl | `get`, `describe` | Read |
| kubectl | `apply`, `scale` | Write |
| kubectl | `delete`, `drain` | Dangerous |

See [Command-Level Safety](./command-safety.md) and [Local CLI Tools](../features/local-cli-tools.md) for complete details.

## Blocked Tools Warning

In Ask mode, users see a warning banner showing blocked tool counts:

```
⚠️ 12 tools blocked in Ask mode (8 write, 4 dangerous)
```

### Warning Features

- **Expandable**: Click to see list of blocked tools
- **Dismissible**: Close for the current session
- **Link to Settings**: Quick access to Tool Access settings

### Indicator in Input Area

A small indicator shows blocked tools near the input:

```
🛡️ 12 tools blocked
```

## API Reference

### Classification Store

```typescript
import { useToolClassificationStore } from '@/stores/toolClassificationStore';

// Get classification for a tool
const classification = getClassification('mcp_server_create_resource');
// Returns: 'read' | 'write' | 'dangerous'

// Check if tool is allowed in Ask mode
const allowed = isAllowedInAskMode('mcp_server_get_data');
// Returns: true (for read tools only)

// Override classification
setClassification('mcp_server_custom_tool', 'read');

// Get statistics
const stats = getStats(allToolNames);
// Returns: { total, read, write, dangerous, overridden }

// Get count of blocked tools
const blockedCount = getBlockedToolCount(allToolNames);
```

### Classification Types

```typescript
type ToolClassification = 'read' | 'write' | 'dangerous';

interface ToolClassificationState {
  overrides: Record<string, ToolClassification>;
  getClassification: (toolName: string) => ToolClassification;
  setClassification: (toolName: string, classification: ToolClassification) => void;
  removeOverride: (toolName: string) => void;
  isAllowedInAskMode: (toolName: string) => boolean;
  getBlockedToolCount: (allToolNames: string[]) => number;
}
```

## Best Practices

### For Administrators

1. **Review new MCP tools** - Check classifications when adding servers
2. **Use specific names** - Name MCP tools with clear prefixes (get_, create_, delete_)
3. **Document overrides** - Keep track of why classifications were changed
4. **Periodic audits** - Review classifications quarterly

### For MCP Server Authors

1. **Use standard prefixes** - Follow the naming conventions above
2. **Read-only by default** - Prefer read operations when possible
3. **Clear naming** - Make tool purpose obvious from the name
4. **Document behavior** - Include detailed descriptions

### For Organizations

1. **Establish policies** - Define who can override classifications
2. **Consider GitOps** - Disable Plan mode for production clusters
3. **Audit logs** - Monitor tool usage through activity logs
4. **Training** - Ensure users understand the mode system

## Troubleshooting

### Tool Not Working in Ask Mode

1. Check the tool's classification in Settings > Tool Access
2. If classified as 'write' or 'dangerous', it's blocked by design
3. Override to 'read' only if the tool is truly read-only
4. Switch to Plan mode for write operations

### MCP Tool Incorrectly Classified

1. The auto-classifier uses naming patterns
2. Tools with unusual names default to 'write' (safe default)
3. Override classification manually if needed
4. Consider renaming the tool to match patterns

### Override Not Persisting

1. Overrides are stored in browser localStorage
2. Check browser privacy settings
3. Overrides are per-browser, not synced
4. Use the same browser for consistent experience

## Related

- [Guardrails Overview](./overview.md) - All safety mechanisms
- [Command-Level Safety](./command-safety.md) - Per-command classification for CLI tools
- [Local CLI Tools](../features/local-cli-tools.md) - Desktop CLI tool integration
- [Ask Mode](../features/ask-mode.md) - Read-only exploration
- [Plan & Approve Mode](../features/plan-mode.md) - Safe change execution
- [MCP Servers](../integrations/overview.md) - External tool integration
