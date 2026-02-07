# Using Skills

This guide covers how to configure and use skills in KubeAgentiX.

## Enabling Skills

Skills are controlled by a feature flag. To enable:

1. Open **Settings** (gear icon)
2. Go to **Features** tab
3. Enable **Skills System**

Once enabled, the agent will discover and use available skills.

## Viewing Skills

To see all available skills:

1. Open **Settings**
2. Go to **Skills** tab
3. Browse skills by source (Bundled, Global, Workspace)

Each skill shows:
- Name and description
- Mode compatibility (insight/control/both)
- Source location
- Tags for categorization

## Skill Sources

### Bundled Skills
Pre-installed skills that ship with KubeAgentiX. These provide foundational capabilities for common Kubernetes operations.

### Global Skills
Your personal skills stored in `~/.kubeagentix/skills/`. These are available across all workspaces.

To add a global skill:
```bash
mkdir -p ~/.kubeagentix/skills/my-skill
# Create SKILL.md in the directory
```

### Workspace Skills
Project-specific skills in `<workspace>/.kubeagentix/skills/`. These are only available when working in that workspace and take precedence over global skills with the same name.

To add a workspace skill:
```bash
mkdir -p .kubeagentix/skills/my-skill
# Create SKILL.md in the directory
```

## Per-Workspace Configuration

You can configure which skills are enabled for each workspace:

### Enable All Skills
By default, all discovered skills are available.

### Enable Specific Skills
Limit which skills are available:
1. Open workspace settings
2. Go to Skills section
3. Select specific skills to enable

### Disable Specific Skills
Hide certain skills from the agent:
1. Open workspace settings
2. Go to Skills section
3. Toggle off unwanted skills

## Skill Priority

When multiple skills have the same name, the highest priority wins:

1. **Workspace skills** (highest priority)
2. **Global skills**
3. **Bundled skills** (lowest priority)

This allows you to override bundled behavior with custom implementations.

## Creating Skills

### From the UI

1. Go to **Settings > Skills**
2. Click **Create Skill**
3. Choose creation mode:

#### AI Generate
Describe what you want in natural language:
```
"Create a skill for debugging OOMKilled pods that checks memory limits
and suggests fixes"
```
The AI generates a complete SKILL.md file.

#### From Runbook
Convert existing documentation:
1. Paste your runbook text
2. AI converts to SKILL.md format
3. Review and edit
4. Save

#### From Template
Start with a structured template:
1. Fill in name and description
2. Add your steps
3. Customize troubleshooting section

### Manual Creation

Create a SKILL.md file directly:

```bash
# Global skill
mkdir -p ~/.kubeagentix/skills/my-skill
cat > ~/.kubeagentix/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: What this skill does
mode: both
tags: [kubernetes]
---

# My Skill

## When to Use
...

## Steps
...
EOF
```

## Using Skills in Chat

Skills are activated automatically when your request matches a skill's description or triggers.

### Natural Activation
Just describe what you need:
```
"Debug why my nginx pod keeps crashing"
```
The agent will use relevant debugging skills.

### Explicit Activation
Reference a skill by name:
```
"Use the k8s-debug skill to troubleshoot this deployment"
```

### Skills in Control Mode
When in Control mode, skills with `mode: control` or `mode: both` are available for operations that modify your cluster.

The agent will:
1. Load the relevant skill
2. Generate a plan following skill instructions
3. Request your approval
4. Execute with skill guidance

## Mode Interactions

| Agent Mode | Skill Mode | Behavior |
|------------|------------|----------|
| Insight | `insight` | Full skill available |
| Insight | `control` | Skill not available |
| Insight | `both` | Read-only parts only |
| Control | `insight` | Full skill available |
| Control | `control` | Full skill with approval |
| Control | `both` | Full skill with approval |

## Troubleshooting

### Skills Not Loading

1. Verify the feature flag is enabled
2. Check SKILL.md format (valid YAML frontmatter)
3. Ensure name matches directory name
4. Check for validation errors in console

### Skill Not Activating

1. Verify skill mode matches current agent mode
2. Check skill description for relevant keywords
3. Try explicitly mentioning the skill name
4. Verify skill is enabled for the workspace

### Validation Errors

Common issues:
- **Name mismatch**: Directory name must match `name:` in frontmatter
- **Invalid characters**: Name must be lowercase alphanumeric with hyphens
- **Missing description**: Description field is required
- **Invalid mode**: Must be `insight`, `control`, or `both`

### Debugging Skill Discovery

Check the browser console for skill loading messages:
```
[K8sAgent] Loaded 5 skills
[SkillsLoader] Discovered: k8s-debug (workspace), prometheus-query (global)
```

## Best Practices

### Organize by Domain
Group related skills:
```
skills/
├── debugging/
│   └── SKILL.md
├── monitoring/
│   └── SKILL.md
└── gitops/
    └── SKILL.md
```

### Version Control Skills
Keep workspace skills in git:
```
.kubeagentix/
└── skills/
    └── team-runbook/
        └── SKILL.md
```

### Share With Team
Global skills can be synced via dotfiles or shared config.

### Test in Insight Mode First
Verify read operations before using control mode.

### Document Custom Skills
Include usage examples and context in your skills.
