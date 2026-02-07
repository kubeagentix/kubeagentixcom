# Skills System

The Skills System extends the AI agent with domain-specific knowledge and workflows. Skills are reusable instructions that guide the agent through common Kubernetes operations, troubleshooting scenarios, and best practices.

## Overview

Skills enhance agent capabilities by:

- **Providing expert knowledge**: Skills encode best practices and proven troubleshooting workflows
- **Improving consistency**: Same approach is applied every time for similar problems
- **Enabling customization**: Create skills specific to your organization's runbooks and procedures
- **Respecting modes**: Skills work within Insight (read-only) and Control (write) mode constraints

## How Skills Work

1. **Discovery**: Skills are discovered from three locations:
   - Bundled skills (shipped with KubeAgentiX)
   - Global skills (`~/.kubeagentix/skills/`)
   - Workspace skills (`<workspace>/.kubeagentix/skills/`)

2. **Injection**: Available skills are injected into the agent's system prompt as XML

3. **Activation**: When a user request matches a skill's description or triggers, the agent reads and follows the skill's instructions

4. **Execution**: The agent executes skill steps using existing tools (kubectl, prometheus queries, etc.)

## Skill Sources

Skills are loaded in priority order (higher priority overrides lower):

| Source | Location | Priority |
|--------|----------|----------|
| Workspace | `<workspace>/.kubeagentix/skills/` | Highest |
| Global | `~/.kubeagentix/skills/` | Medium |
| Bundled | Built into KubeAgentiX | Lowest |

This allows workspace-specific overrides of global or bundled skills.

## Mode Compatibility

Skills declare their mode compatibility:

| Mode | Description | When Used |
|------|-------------|-----------|
| `insight` | Read-only operations | Works in both Insight and Control modes |
| `control` | Requires write access | Only active in Control mode |
| `both` | Adapts to current mode | Uses read-only parts in Insight, full in Control |

## Feature Flag

Skills are controlled by the `skillsEnabled` feature flag. When disabled:
- Skills are not loaded
- Agent operates without skill guidance
- No skill-related UI appears

## Quick Start

1. Enable skills in Settings > Features > Skills System
2. View available skills in Settings > Skills
3. Create a custom skill from description or runbook
4. Use skills naturally - the agent will activate them when relevant

## Next Steps

- [Writing Skills](./writing-skills.md) - Learn the SKILL.md format
- [Using Skills](./using-skills.md) - Configure skills per workspace
