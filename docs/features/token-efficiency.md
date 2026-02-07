---
sidebar_position: 8
title: Token Efficiency
description: How KubeAgentics minimizes AI context costs while maximizing capabilities
---

# Token Efficiency

KubeAgentics employs sophisticated techniques to minimize token usage and AI costs while maximizing available capabilities. This page explains our approach and compares it with other tools.

## Overview

AI-powered tools face a fundamental challenge: **more tools = more context = higher costs**. Every tool definition adds to the system prompt, consuming tokens that could be used for actual conversation.

KubeAgentics solves this with a **Tools Broker** pattern that keeps context minimal while making all capabilities available.

## The Problem with Traditional Approaches

Most AI-powered DevOps tools send full tool schemas to the AI:

```
Traditional Approach:
┌──────────────────────────────────────────────────┐
│ System Prompt (~500 tokens)                       │
├──────────────────────────────────────────────────┤
│ Tool 1: Full schema + description (~200 tokens)  │
│ Tool 2: Full schema + description (~200 tokens)  │
│ Tool 3: Full schema + description (~200 tokens)  │
│ ...                                               │
│ Tool 50: Full schema + description (~200 tokens) │
├──────────────────────────────────────────────────┤
│ Total Tool Context: ~10,000 tokens               │
└──────────────────────────────────────────────────┘
```

This creates several problems:

| Problem | Impact |
|---------|--------|
| **High token costs** | 10K+ tokens per query just for tool context |
| **Slower responses** | Larger context = longer processing time |
| **Context limits** | Less room for conversation history |
| **Wasted resources** | Most tools unused in any given query |

## Our Solution: Tools Broker Pattern

KubeAgentics uses a **Tools Broker** that dynamically manages tool context:

```
KubeAgentics Approach:
┌──────────────────────────────────────────────────┐
│ System Prompt (~500 tokens)                       │
├──────────────────────────────────────────────────┤
│ Available tools: kubectl, prometheus             │
│ CLI: argocd, docker, helm, kubectl, terraform    │
│ MCP: github:create_issue, jira:get_issues        │
│ (Read-only mode: write tools blocked)            │
├──────────────────────────────────────────────────┤
│ Total Tool Context: ~200 tokens                  │
└──────────────────────────────────────────────────┘
```

### Key Optimizations

#### 1. Minimal Tool Summary

Instead of full JSON schemas, we send a compact summary:

```typescript
// Traditional: ~200 tokens per tool
{
  "name": "argocd",
  "description": "GitOps continuous delivery tool for Kubernetes. Run argocd commands locally.",
  "parameters": {
    "command": {
      "type": "array",
      "description": "Command arguments for argocd. Examples: ['app', 'list'] or ['app', 'sync', 'my-app']",
      "required": true
    }
  },
  "required": ["command"]
}

// KubeAgentics: ~10 tokens
"CLI: argocd, docker, helm"
```

#### 2. Mode-Based Filtering

In Ask mode, write/dangerous tools are excluded from context entirely:

```
Ask Mode Context:
- Read tools: ✅ Included in context
- Write tools: ❌ Not sent to AI (saves tokens)
- Dangerous tools: ❌ Not sent to AI (saves tokens)

Result: 50% fewer tools in context
```

#### 3. Context-Aware Tool Loading

Tools are filtered based on current context:

| Context | Tools Loaded | Tokens Saved |
|---------|--------------|--------------|
| Kubernetes cluster | kubectl, prometheus, helm | ~8K tokens |
| ArgoCD query | argocd, kubectl | ~9K tokens |
| Docker container | docker, kubectl | ~9K tokens |

#### 4. Lazy Tool Registration

Tools are only registered when their dependencies are available:

```
Startup:
1. Check: Is argocd installed? → Register cli_argocd
2. Check: Is helm installed? → Register cli_helm
3. Check: MCP server connected? → Register mcp_* tools

Only installed tools consume context
```

## Token Savings Comparison

### Typical Query: "List all ArgoCD apps"

| Approach | Tool Context | Response Tokens | Total |
|----------|--------------|-----------------|-------|
| **Send all tools** | 10,000 | 500 | 10,500 |
| **KubeAgentics** | 200 | 500 | **700** |
| **Savings** | | | **93%** |

### Complex Query: "Debug failing deployment with metrics"

| Approach | Tool Context | Tool Calls | Total |
|----------|--------------|------------|-------|
| **Traditional** | 10,000 | 3 × 500 = 1,500 | 11,500 |
| **KubeAgentics** | 200 | 3 × 500 = 1,500 | **1,700** |
| **Savings** | | | **85%** |

## Comparison with Other Tools

### vs. Generic AI Assistants (ChatGPT, Claude)

| Feature | Generic AI | KubeAgentics |
|---------|------------|--------------|
| Tool definitions | User must provide | Built-in, optimized |
| Context size | ~4K+ per tool | ~10 tokens per tool |
| Tool filtering | Manual | Automatic by mode |
| Safety classification | None | Per-command level |
| Kubernetes-optimized | No | Yes |

### vs. Other K8s AI Tools

| Feature | Typical K8s AI | KubeAgentics |
|---------|----------------|--------------|
| Tool schemas sent | Full JSON | Compact summary |
| Mode-based filtering | No | Yes (Ask/Plan) |
| CLI tool support | kubectl only | 28+ tools |
| Command-level safety | No | Yes |
| MCP integration | Rare | Full support |

## Implementation Details

### System Prompt Optimization

Our system prompt is designed for efficiency:

```markdown
## AVAILABLE TOOLS

You have access to these tools:

### 1. `kubectl` - Kubernetes CLI commands
Run read-only kubectl commands to inspect cluster resources.

### 2. `prometheus` - Metrics queries (if configured)
Query Prometheus for CPU, memory, network, and other metrics.

### 3. CLI Tools - Local command-line tools
Execute commands using locally installed CLI tools like argocd, docker, helm, terraform, etc.

**Tool naming**: CLI tools use direct names (e.g., `docker`, `argocd`, `helm`) for better LLM comprehension.
The `command` parameter accepts an array of arguments.
```

This gives the AI enough context to use tools correctly without bloating the prompt.

### Dynamic Tool Summary

The Tools Broker generates a one-line summary:

```typescript
function getToolSummaryForPrompt(tools): string {
  // Group by category (CLI tools use schema.category = 'cli')
  const builtin = tools.filter(t => t.schema?.category !== 'cli' && !t.name.startsWith('mcp_'));
  const cli = tools.filter(t => t.schema?.category === 'cli');
  const mcp = tools.filter(t => t.name.startsWith('mcp_'));

  // Build compact summary
  return `Available tools: K8s: ${builtin.join(', ')} | CLI: ${cli.join(', ')} | MCP: ${mcp.join(', ')}`;
}

// Result: "Available tools: K8s: kubectl, prometheus | CLI: argocd, docker, helm | MCP: github:create_issue"
// ~50 tokens instead of ~10,000
```

### Tool Filter Chain

```
User Query
    │
    ▼
┌─────────────────────────────────┐
│ 1. Check if tool is installed   │
│    (CLI tools via system check) │
├─────────────────────────────────┤
│ 2. Check if tool is enabled     │
│    (User settings)              │
├─────────────────────────────────┤
│ 3. Check mode restrictions      │
│    (Ask mode = read-only)       │
├─────────────────────────────────┤
│ 4. Check safety classification  │
│    (Read/Write/Dangerous)       │
└─────────────────────────────────┘
    │
    ▼
Filtered Tool List → Minimal Context
```

## Cost Impact

### Example: Production Kubernetes Cluster

Assume:
- 50+ available tools (kubectl, CLI tools, MCP servers)
- 100 queries per day
- $0.01 per 1K input tokens

| Approach | Daily Token Cost | Monthly Cost |
|----------|------------------|--------------|
| **Full tool schemas** | 100 × 10K = 1M tokens | $300 |
| **KubeAgentics** | 100 × 200 = 20K tokens | **$6** |
| **Savings** | | **$294/month** |

### Enterprise Scale (1000 queries/day)

| Approach | Monthly Cost |
|----------|--------------|
| **Full tool schemas** | $3,000 |
| **KubeAgentics** | **$60** |
| **Annual Savings** | **$35,280** |

## Best Practices

### For Users

1. **Use Ask mode by default** - Fewer tools in context = faster responses
2. **Enable only needed tools** - Disable tools you don't use
3. **Review tool settings** - Check Settings → Local CLI for tool management

### For Administrators

1. **Audit enabled tools** - Disable unused MCP servers
2. **Monitor token usage** - Check analytics for optimization opportunities
3. **Consider mode defaults** - Set Ask mode as default for cost control

## Technical Reference

### Tools Broker API

```typescript
import { toolBroker } from '@/services/toolBroker';

// Get minimal tool summary for system prompt
const summary = toolBroker.getToolSummaryForPrompt(allTools);
// Returns: "Available tools: K8s: kubectl | CLI: argocd, docker | (Read-only mode)"

// Create context-aware tool bundle
const bundle = toolBroker.createToolBundle(allTools, {
  namespace: 'production',
  recentTools: ['kubectl', 'prometheus'],
});
```

### Configuration

```typescript
// Enable/disable tools in settings
useToolsStore.getState().toggleTool('argocd');

// Tools are automatically filtered at query time
// No need to reload the agent
```

## Related

- [Local CLI Tools](./local-cli-tools.md) - CLI tool discovery and usage
- [Ask Mode](./ask-mode.md) - Read-only exploration (minimal context)
- [Plan Mode](./plan-mode.md) - Full tool access with approval
- [Command-Level Safety](../guardrails/command-safety.md) - Per-command classification
- [Tool Classification](../guardrails/tool-classification.md) - Managing tool access
