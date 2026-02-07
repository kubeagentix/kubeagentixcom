---
slug: 93-percent-token-reduction-tools-broker-pattern
title: "How We Achieved 93% Token Reduction with the Tools Broker Pattern"
authors: [kubeagentics]
tags: [ai, optimization, tokens, architecture]
description: A deep dive into how KubeAgentics reduces AI context costs by 93% while maintaining full tool capabilities using the Tools Broker pattern.
---

# How We Achieved 93% Token Reduction with the Tools Broker Pattern

AI-powered developer tools face a fundamental challenge: **more tools = more context = higher costs**. When you're building an AI assistant that can execute 50+ tools, sending full tool schemas to the LLM can consume 10,000+ tokens per query—before the user even asks a question.

At KubeAgentics, we solved this problem with what we call the **Tools Broker Pattern**, achieving a **93% reduction in token usage** while maintaining full access to all available tools.

<!-- truncate -->

## The Problem: Tool Schema Bloat

Let's look at a typical tool definition for AI function calling:

```json
{
  "name": "argocd",
  "description": "GitOps continuous delivery tool for Kubernetes. Run argocd commands locally.",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Command arguments for argocd. Examples: ['app', 'list'] or ['app', 'sync', 'my-app']"
      }
    },
    "required": ["command"]
  }
}
```

This single tool definition is approximately **200 tokens**. Now multiply that by 50 tools:

| Scenario | Token Count |
|----------|-------------|
| 1 tool | 200 tokens |
| 10 tools | 2,000 tokens |
| 50 tools | 10,000 tokens |

That's **10,000 tokens per query** just for tool context—and we haven't even included the system prompt, conversation history, or the user's actual question.

## The Traditional Approach

Most AI-powered tools send the full schema for every available tool to the LLM:

```
┌──────────────────────────────────────────────────┐
│ System Prompt (~500 tokens)                       │
├──────────────────────────────────────────────────┤
│ Tool 1: Full JSON schema (~200 tokens)           │
│ Tool 2: Full JSON schema (~200 tokens)           │
│ Tool 3: Full JSON schema (~200 tokens)           │
│ ...                                               │
│ Tool 50: Full JSON schema (~200 tokens)          │
├──────────────────────────────────────────────────┤
│ User Query (~50 tokens)                          │
├──────────────────────────────────────────────────┤
│ Total: ~10,550 tokens                            │
└──────────────────────────────────────────────────┘
```

### Why This Hurts

1. **Cost**: At $0.01 per 1K input tokens, that's $0.10+ per query just for tool context
2. **Latency**: Larger context = longer processing time
3. **Context limits**: Less room for conversation history and actual content
4. **Waste**: Most tools are unused in any given query

## Our Solution: The Tools Broker Pattern

The Tools Broker acts as an intelligent intermediary between your tool registry and the LLM. Instead of sending full schemas, it provides a **minimal summary** that gives the AI enough context to know what's available without the overhead.

### Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Tool Registry  │────▶│  Tools Broker    │────▶│    LLM      │
│  (50+ tools)    │     │  (filters &      │     │  (minimal   │
│                 │     │   summarizes)    │     │   context)  │
└─────────────────┘     └──────────────────┘     └─────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Context Factors │
                        │  - Current mode  │
                        │  - User settings │
                        │  - Recent tools  │
                        └──────────────────┘
```

### The Minimal Summary Approach

Instead of full JSON schemas, we send a compact summary:

```typescript
// Traditional: ~10,000 tokens for 50 tools
[Full JSON schemas for every tool...]

// Tools Broker: ~200 tokens for 50 tools
"Available tools: K8s: kubectl, prometheus | CLI: argocd, docker, helm, terraform | MCP: github:create_issue, jira:get_issues (Read-only mode: write tools blocked)"
```

The AI now knows:
- What categories of tools exist
- Specific tools available in each category
- Current mode restrictions

That's **50x less tokens** with the same functional awareness.

## Implementation Deep Dive

### 1. Tool Summary Generation

```typescript
class ToolBroker {
  getToolSummaryForPrompt(allTools: Tool[]): string {
    // Group tools by category
    const byCategory: Record<string, string[]> = {
      builtin: [],
      cli: [],
      mcp: [],
    };

    for (const tool of this.filterEnabledTools(allTools)) {
      const category = this.categorize(tool.name);
      byCategory[category].push(this.shortName(tool.name));
    }

    // Build compact summary
    const parts: string[] = [];

    if (byCategory.builtin.length > 0) {
      parts.push(`K8s: ${byCategory.builtin.join(', ')}`);
    }
    if (byCategory.cli.length > 0) {
      parts.push(`CLI: ${byCategory.cli.join(', ')}`);
    }
    if (byCategory.mcp.length > 0) {
      parts.push(`MCP: ${byCategory.mcp.join(', ')}`);
    }

    const modeNote = this.isReadOnlyMode()
      ? ' (Read-only mode: write tools blocked)'
      : '';

    return `Available tools: ${parts.join(' | ')}${modeNote}`;
  }
}
```

### 2. Mode-Based Filtering

In "Ask" mode (read-only), we exclude write and dangerous tools entirely:

```typescript
filterEnabledTools(tools: Tool[]): Tool[] {
  return tools.filter(tool => {
    // Check user settings
    if (!this.isToolEnabled(tool.name)) return false;

    // Check mode restrictions
    if (this.isAskMode() && !this.isReadOnly(tool.name)) return false;

    return true;
  });
}
```

This means:
- **Ask mode**: Only read tools in context (~50% reduction)
- **Plan mode**: All enabled tools (still using minimal format)

### 3. System Prompt Integration

We embed tool guidance directly in the system prompt:

```typescript
const systemPrompt = `
You are KubeAgentics, an AI-powered Kubernetes assistant.

## AVAILABLE TOOLS

### kubectl - Kubernetes CLI
Run read-only kubectl commands to inspect cluster resources.

### CLI Tools
Execute locally installed tools: argocd, docker, helm, terraform, etc.
Tool naming: Direct names (docker, argocd, helm) with command array parameter.

Example: argocd with command ["app", "list"]

${toolBroker.getToolSummaryForPrompt(tools)}
`;
```

The LLM receives:
1. High-level tool categories with examples
2. Usage patterns (naming convention, parameter format)
3. Current availability summary

**Total context: ~500 tokens** instead of 10,000+.

## Results: 93% Token Reduction

### Typical Query Comparison

**Query**: "List all ArgoCD apps"

| Approach | Tool Context | Other Context | Total |
|----------|--------------|---------------|-------|
| Full schemas | 10,000 | 550 | 10,550 |
| Tools Broker | 200 | 550 | **750** |
| **Reduction** | | | **93%** |

### Monthly Cost Impact

Assuming 100 queries/day at $0.01 per 1K input tokens:

| Approach | Daily Tokens | Monthly Cost |
|----------|--------------|--------------|
| Full schemas | 1M tokens | $300 |
| Tools Broker | 75K tokens | **$22.50** |
| **Savings** | | **$277.50/mo** |

At enterprise scale (1000 queries/day), that's **$2,775/month in savings**.

## How You Can Implement This

### Step 1: Categorize Your Tools

Group tools by category for efficient summarization:

```typescript
const CATEGORIES = {
  kubernetes: ['kubectl', 'helm', 'kustomize'],
  containers: ['docker', 'podman', 'containerd'],
  cloud: ['aws', 'gcloud', 'az'],
  // ...
};
```

### Step 2: Use Direct Tool Names

Use direct tool names that LLMs already understand:

```typescript
// Direct names for better LLM comprehension
const toolName = 'docker';  // Not 'cli_docker'
const toolName = 'argocd';  // Not 'cli_argocd'
const toolName = 'helm';    // Not 'cli_helm'

// For MCP tools, extract the meaningful part
function shortName(mcpToolName: string): string {
  return mcpToolName.replace(/^mcp_\w+_/, '');
}
// mcp_github_create_issue -> create_issue
```

### Step 3: Implement Mode-Based Filtering

Filter tools before summarization:

```typescript
function filterByMode(tools: Tool[], mode: 'ask' | 'plan'): Tool[] {
  if (mode === 'ask') {
    return tools.filter(t => t.classification === 'read');
  }
  return tools;
}
```

### Step 4: Document Patterns in System Prompt

Instead of schemas, describe patterns:

```markdown
## CLI Tools

CLI tools use direct names and accept a `command` array parameter.

Examples:
- `docker` with command `["ps"]` - list containers
- `argocd` with command `["app", "list"]` - list apps
- `helm` with command `["list", "-A"]` - list releases
```

### Step 5: Generate Dynamic Summary

Build the summary at query time:

```typescript
const summary = `Available: ${
  Object.entries(categories)
    .filter(([_, tools]) => tools.length > 0)
    .map(([cat, tools]) => `${cat}: ${tools.join(', ')}`)
    .join(' | ')
}`;
```

## Trade-offs and Considerations

### What We Sacrifice

1. **Parameter hints**: The LLM doesn't see exact parameter schemas
2. **Detailed descriptions**: Tool purposes are summarized, not detailed
3. **Validation hints**: Required vs optional parameters aren't specified

### Why It Still Works

1. **Pattern recognition**: LLMs are excellent at recognizing patterns from examples
2. **System prompt guidance**: Detailed examples cover common use cases
3. **Error recovery**: If the AI gets parameters wrong, execution errors guide correction
4. **Focused context**: Less noise = better signal for tool selection

### When to Use Full Schemas

Consider full schemas when:
- You have fewer than 10 tools
- Tool parameters are highly complex
- Error tolerance is very low
- Cost is not a concern

## Conclusion

The Tools Broker Pattern demonstrates that **less is more** when it comes to AI tool context. By summarizing instead of serializing, filtering by mode, and documenting patterns, we achieved:

- **93% reduction** in tool-related token usage
- **$277/month savings** at moderate scale
- **Faster responses** due to smaller context
- **More room** for conversation history

The key insight: LLMs don't need full JSON schemas to use tools effectively. They need to know **what's available** and **how to invoke it**. Everything else is overhead.

---

*Want to see the Tools Broker Pattern in action? [Try KubeAgentics](https://kubeagentics.dev) - our AI-powered Kubernetes desktop companion that implements these optimizations and more.*

## Further Reading

- [Token Efficiency Documentation](/docs/features/token-efficiency) - Technical details
- [Local CLI Tools](/docs/features/local-cli-tools) - CLI tool integration
- [Command-Level Safety](/docs/guardrails/command-safety) - Per-command classification
