# Writing Skills

Skills are defined in `SKILL.md` files with YAML frontmatter and markdown instructions. This format is compatible with the [agentskills.io](https://agentskills.io) specification with KubeAgentiX extensions.

## File Structure

Each skill lives in its own directory:

```
skills/
├── k8s-debug/
│   └── SKILL.md
├── prometheus-query/
│   └── SKILL.md
└── my-custom-skill/
    └── SKILL.md
```

**Important**: The directory name must match the skill name in the frontmatter.

## SKILL.md Format

```yaml
---
name: my-skill-name
description: What this skill does and when it should be used
mode: both
tags: [kubernetes, debugging]
version: 1.0.0
author: Your Name
tools: [kubectl, prometheus]
triggers: [CrashLoopBackOff, OOMKilled]
---

# Skill Title

## When to Use
Describe scenarios where this skill applies.
- "When pods are stuck in CrashLoopBackOff"
- "When debugging memory issues"

## Prerequisites
- List required tools
- Required permissions
- Expected cluster state

## Steps

1. **First Step**
   - Detailed instruction
   - `kubectl get pods -n {{namespace}}`

2. **Second Step**
   - Another instruction
   - Include specific commands

3. **Verification**
   - How to verify success

## Troubleshooting

### If Step 1 Fails
Try this alternative approach...

### Common Error X
This usually means... Fix by...
```

## Frontmatter Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique identifier. Lowercase, alphanumeric, hyphens only. Max 64 chars. Must match directory name. |
| `description` | string | What the skill does. Max 1024 chars. Used for skill discovery and activation. |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | string | `both` | Mode compatibility: `insight`, `control`, or `both` |
| `tags` | array | `[]` | Categorization tags for discovery |
| `version` | string | - | Semantic version for tracking changes |
| `author` | string | - | Skill author |
| `tools` | array | - | Hints about which tools the skill uses |
| `triggers` | array | - | Keywords that should activate this skill |

## Mode Guidelines

### insight Mode
For read-only operations:
- Querying pod status
- Reading logs
- Checking metrics
- Describing resources

```yaml
mode: insight
```

### control Mode
For operations requiring modifications:
- Scaling deployments
- Deleting pods
- Applying configurations
- Helm upgrades

```yaml
mode: control
```

### both Mode
For skills that adapt:
- Use read-only operations in Insight mode
- Full operations (including writes) in Control mode

```yaml
mode: both
```

## Writing Effective Instructions

### Be Specific
Instead of "check the logs", write:
```markdown
Check pod logs for errors:
`kubectl logs <pod-name> -n {{namespace}} --tail=100`
```

### Include Commands
Provide exact commands the agent should run:
```markdown
1. Get pod status:
   `kubectl get pods -n {{namespace}} -o wide`

2. Describe the failing pod:
   `kubectl describe pod {{pod_name}} -n {{namespace}}`
```

### Use Placeholders
Use `{{variable}}` syntax for dynamic values:
- `{{namespace}}` - Current namespace
- `{{pod_name}}` - Target pod
- `{{deployment}}` - Target deployment

### Structure for Reasoning
Help the agent understand decision points:
```markdown
## Decision Tree

If pod status is `ImagePullBackOff`:
- Check image name and tag
- Verify registry access
- Check pull secrets

If pod status is `CrashLoopBackOff`:
- Check container logs
- Verify resource limits
- Check liveness probes
```

### Include Troubleshooting
Always add a troubleshooting section:
```markdown
## Troubleshooting

### Permission Denied
If you see "forbidden" errors:
- Check RBAC permissions
- Verify service account

### Resource Not Found
If the resource doesn't exist:
- Verify the namespace
- Check for typos in names
```

## AI-Generated Skills

You can generate skills using AI:

### From Description
Describe what you want and the AI generates the SKILL.md:

```
"Create a skill for debugging OOMKilled pods that checks memory limits,
analyzes metrics, and suggests fixes"
```

### From Runbook
Convert existing runbooks to skills:

1. Paste your runbook content
2. AI converts it to SKILL.md format
3. Review and customize
4. Save to your skills directory

## Validation

Skills are validated when loaded:

- Name must be lowercase alphanumeric with hyphens
- Name must match directory name
- Description is required
- Mode must be valid (`insight`, `control`, or `both`)
- Content must exist after frontmatter

Invalid skills are logged and skipped.

## Example Skills

### Pod Debugging Skill

```yaml
---
name: k8s-debug-pod
description: Debug Kubernetes pods that are not running correctly
mode: both
tags: [kubernetes, debugging, pods]
triggers: [CrashLoopBackOff, ImagePullBackOff, Pending]
---

# Debug Kubernetes Pod

## When to Use
- Pod stuck in CrashLoopBackOff
- Pod stuck in ImagePullBackOff
- Pod stuck in Pending state
- Pod restarting frequently

## Steps

1. **Check Pod Status**
   Get detailed pod information:
   `kubectl get pod {{pod_name}} -n {{namespace}} -o wide`

2. **Check Events**
   Look for scheduling or pull errors:
   `kubectl describe pod {{pod_name}} -n {{namespace}}`

3. **Check Logs**
   If container started, check logs:
   `kubectl logs {{pod_name}} -n {{namespace}} --tail=100`

4. **Check Resource Usage**
   Verify if hitting limits:
   `kubectl top pod {{pod_name}} -n {{namespace}}`

## Troubleshooting

### CrashLoopBackOff
- Check container exit code in describe output
- Review logs for application errors
- Verify environment variables and config

### ImagePullBackOff
- Verify image name and tag
- Check registry credentials (imagePullSecrets)
- Test registry connectivity

### Pending
- Check node resources (CPU, memory)
- Verify node selectors and taints
- Check PVC bindings
```

## Best Practices

1. **Start simple**: Create focused skills for specific tasks
2. **Test thoroughly**: Verify skills work in both modes
3. **Document well**: Clear instructions help the agent succeed
4. **Include examples**: Show expected output when helpful
5. **Version control**: Track skill changes over time
