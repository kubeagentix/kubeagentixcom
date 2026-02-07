---
slug: system-prompt-engineering-agentic-ops
title: "The Art of System Prompts for Agentic Ops: What Works, What Breaks, and Why"
authors: [gourav-shah]
tags: [ai, llm, prompt-engineering, agentic, devops, kubernetes]
description: A practical guide to writing system prompts for AI agents that execute real operations. Learn from our mistakes - verbose prompts don't mean better agents.
---

# The Art of System Prompts for Agentic Ops: What Works, What Breaks, and Why

We recently shipped a "small improvement" to our AI agent's system prompt. Within hours, users reported that simple queries like "list all pods" were returning JSON plans instead of actual results. The agent had stopped *doing* and started *describing*.

The fix? Fewer words, not more.

This post shares what we learned about writing system prompts for agentic applications—AI systems that don't just chat, but actually execute operations.

<!-- truncate -->

## The Agentic Prompt Paradox

Traditional prompt engineering teaches: "Be specific. Provide context. Give examples." This works great for chat assistants. For agentic systems? It can be catastrophic.

Here's why: **Agents have two communication channels—the prompt AND the tools.** When you over-describe tools in the prompt, you create ambiguity about which channel to use.

## A Real-World Failure

We wanted to make our tool descriptions dynamic. Instead of a hardcoded list, we'd inject actual tool definitions. Sounds reasonable, right?

**Before (working):**
```
## TOOLS

**kubectl** - K8s read-only: get, describe, logs, top, explain

**prometheus** - Metrics queries (query, time_range params)

**CLI Tools:** docker, helm, aws, terraform, git
```

**After (broken):**
```
## TOOLS

**Kubernetes Tools:**
- `kubectl`: Execute kubectl commands to interact with the Kubernetes cluster.
  Supports all kubectl operations based on the current mode:
  - In ASK mode: Read-only operations (get, describe, logs, etc.)
  - In PLAN mode: Full access including write operations...

  Read commands (always allowed):
  - "get pods -n <namespace>" - list pods
  - "get pods -n <namespace> -o wide" - list pods with details
  - "logs <pod-name> -n <namespace>" - get pod logs
  ...
```

The verbose version included every parameter, every example, every edge case. It was *thorough*. It was also broken.

**User query:** "list pods in the instavote namespace"

**Expected response:** Agent calls kubectl tool, returns pod list

**Actual response:**
```json
{
  "operation": "read",
  "type": "direct",
  "command": "get pods -n instavote",
  "description": "List all pods in the instavote namespace.",
  "confidence": 1.0
}
```

The agent started outputting *plans* instead of *executing*. It saw detailed command formats in the prompt and mimicked that structure in its output.

## Why This Happens

LLMs are pattern matchers. When your system prompt contains structured data like:
```
- "get pods -n <namespace>" - list pods
- "logs <pod-name> -n <namespace>" - get pod logs
```

The model learns: "Ah, I should output structured command descriptions." It's doing exactly what you (accidentally) trained it to do.

### The Two-Channel Problem

Agentic systems have:
1. **System Prompt** - High-level guidance, behavioral rules
2. **Tool Definitions** - Detailed schemas, parameters, descriptions

When you duplicate tool details in the system prompt, you create confusion:
- Should I describe the tool (prompt pattern)?
- Should I call the tool (tool interface)?

The model sometimes picks the wrong one.

## Principles for Agentic Prompts

### 1. Separate Concerns: Guidance vs. Specification

**System Prompt:** *What* to do, *when* to act, *how* to behave
**Tool Definitions:** *How* to call tools, parameter schemas, technical details

```
❌ BAD (in system prompt):
"Use kubectl with command parameter. Example: get pods -n namespace"

✅ GOOD (in system prompt):
"kubectl - K8s operations: get, describe, logs, top"

✅ GOOD (in tool definition):
{
  "name": "kubectl",
  "parameters": {
    "command": { "type": "string", "description": "kubectl command without prefix" }
  }
}
```

### 2. Imperative Over Descriptive

Tell the agent what to DO, not what it CAN do.

```
❌ DESCRIPTIVE:
"You have access to kubectl which can execute Kubernetes commands
including get, describe, logs, and other operations..."

✅ IMPERATIVE:
"ALWAYS use kubectl for Kubernetes queries. Never say 'I cannot'
when kubectl can answer the question."
```

### 3. Brevity Signals Confidence

Short tool descriptions signal: "This is straightforward, just use it."
Long descriptions signal: "This is complex, think carefully about format."

```
❌ VERBOSE (signals complexity):
**prometheus** - Execute PromQL queries against the Prometheus metrics backend.
Supports time range selection via the time_range parameter which accepts
values like 5m, 15m, 1h, 24h, 7d. The query parameter should contain valid
PromQL syntax. Results are returned as time series data that will be
rendered as charts in the UI. When analyzing metrics, describe trends
rather than echoing raw numerical data...

✅ CONCISE (signals simplicity):
**prometheus** - Metrics queries with PromQL (query, time_range params)
```

### 4. Golden Rules > Examples

A clear behavioral rule beats ten examples.

```
❌ EXAMPLE-HEAVY:
For AWS queries, use: aws ec2 describe-instances
For Docker queries, use: docker ps
For Helm queries, use: helm list -A
For Git queries, use: git status
...

✅ RULE-BASED:
**GOLDEN RULE:** If a tool exists in your TOOLS section, USE IT to get real data.
Never describe what you would do—actually do it.
```

### 5. Categories Over Catalogs

Group tools by purpose, not by exhaustive listing.

```
❌ CATALOG:
- kubectl: Kubernetes CLI
- docker: Container runtime
- helm: Package manager
- aws: Cloud CLI
- gcloud: Cloud CLI
- az: Cloud CLI
- terraform: IaC
- ansible: Config management
...

✅ CATEGORIZED:
**kubectl** - K8s operations: get, describe, logs, top
**CLI Tools:** docker, helm, aws, gcloud, terraform, ansible, git
```

## The Token Efficiency Bonus

Concise prompts aren't just clearer—they're cheaper.

| Prompt Style | Token Count | Behavior |
|--------------|-------------|----------|
| Verbose tool descriptions | ~2,000 tokens | Confused, outputs plans |
| Concise categorized | ~400 tokens | Direct, executes tools |

Over a 50-message debugging session:
- Verbose: 100,000 extra tokens (~$0.30-1.00 wasted)
- Concise: Baseline cost, correct behavior

## A Template That Works

Here's our battle-tested prompt structure:

```
You are [AGENT_NAME], an AI-powered [DOMAIN] assistant.

## GOLDEN RULE
**ALWAYS use your tools.** Never say "I cannot" when a tool can answer.
If a tool exists below, USE IT to get real data.

## TOOLS

**[primary_tool]** - [one-line description]: [key operations]

**[category]:** [tool1], [tool2], [tool3]

## OUTPUT
- [Format guideline 1]
- [Format guideline 2]

## CONTEXT
- [Runtime variable 1]: {{var1}}
- [Runtime variable 2]: {{var2}}
```

### Real Example

```
You are KubeAgentiX (KAX), an AI-powered Kubernetes operations assistant.

## GOLDEN RULE
**ALWAYS use your tools.** Never say "I cannot" when a tool can answer.
If a tool exists in your TOOLS section, USE IT to get real data.

## TOOLS

**kubectl** - K8s operations: get, describe, logs, top, explain, cluster-info

**prometheus** - Metrics queries with PromQL (query, time_range params)

**CLI Tools:** docker, helm, aws, terraform, git

## OUTPUT
- Format lists as markdown tables
- Use `code` for names/commands, **bold** for issues
- Be concise; analyze results, don't echo raw output

## CONTEXT
- Namespace: {{namespace}}
- Cluster: {{cluster}}
```

**Total: ~250 tokens.** Clear, actionable, and the agent executes correctly.

## Testing Your Prompts

Before shipping prompt changes, test these scenarios:

1. **Simple query:** "list pods" → Should execute tool, not describe it
2. **Ambiguous query:** "check the cluster" → Should pick appropriate tool
3. **Multi-step query:** "find failing pods and get their logs" → Should chain tools
4. **Edge case:** Query about tool not in list → Should say "I don't have access to X"

Watch for these failure modes:
- Agent outputs JSON/structured plans instead of calling tools
- Agent describes what it *would* do instead of doing it
- Agent asks clarifying questions when a tool could answer directly

## Key Takeaways

1. **System prompts guide behavior; tool definitions specify interface.** Don't mix them.

2. **Verbose ≠ better.** Over-described tools create pattern-matching traps.

3. **Imperative beats descriptive.** "USE tools" > "You have access to tools"

4. **Test with simple queries.** If "list pods" breaks, your prompt is wrong.

5. **Token cost correlates with confusion.** Bloated prompts cost more AND work worse.

The best agentic prompts are surprisingly short. They trust the tool interface to handle details and focus on one job: making the agent *act* instead of *describe*.

---

*Building agentic systems? We'd love to hear what prompt patterns work (or spectacularly fail) for you. Share your experiences on [GitHub](https://github.com/kubeagentics/kubeagentics-ce).*
