---
sidebar_position: 7
title: Local CLI Tools
description: Leverage your installed DevOps tools through AI-powered execution
---

# Local CLI Tools

KubeAgentics can discover and execute CLI tools already installed on your system, giving the AI assistant direct access to your DevOps toolchain. This **desktop-first capability** allows seamless integration with tools like Docker, Helm, Terraform, and more.

## Overview

Unlike web-based tools, KubeAgentics runs as a native desktop application with full system access. This unique position allows it to:

- **Discover** CLI tools installed on your system automatically
- **Execute** commands through those tools with proper safety controls
- **Classify** individual commands by risk level (read/write/dangerous)
- **Integrate** results into AI-powered workflows

### Supported Tools

KubeAgentics automatically discovers 28+ common DevOps and Kubernetes tools:

| Category | Tools |
|----------|-------|
| **Version Control** | git |
| **Container Runtime** | docker, podman, containerd, nerdctl, buildah, skopeo |
| **Kubernetes** | kubectl, kind, minikube, k3d, k9s |
| **GitOps** | argocd, flux |
| **Security** | trivy, kubesec, grype, syft, cosign |
| **Cloud CLI** | aws, gcloud, az |
| **Infrastructure** | terraform, pulumi, ansible |
| **Utilities** | jq, yq, curl |
| **Observability** | promtool |

## Getting Started

### Viewing Discovered Tools

1. Open **Settings** (gear icon)
2. Click the **Local CLI** tab
3. View tools grouped by category

Each tool shows:
- **Status**: Installed (green) or Not found (gray)
- **Version**: Detected version number
- **Path**: Installation location
- **Enable toggle**: Allow AI to use this tool

### Enabling Tools

By default, discovered tools are disabled for safety. To enable a tool:

1. Find the tool in the Local CLI settings
2. Click the checkbox to enable it
3. The tool becomes available to the AI assistant

:::tip Start Conservatively
Enable only the tools you need. You can always enable more later.
:::

## Command Safety Classification

### Per-Command Safety (Not Per-Tool)

Unlike traditional tool-level permissions, KubeAgentics classifies safety at the **command level**. This means:

- `docker ps` = **Read** (safe, auto-executed)
- `docker build` = **Write** (requires Plan & Approve)
- `docker rm` = **Dangerous** (requires explicit confirmation)

This granular approach provides much better security than blanket tool access.

### Safety Levels

| Level | Icon | Behavior | Examples |
|-------|------|----------|----------|
| **Read** | Green shield | Auto-executed in Ask & Plan mode | `git status`, `docker ps`, `kubectl get` |
| **Write** | Yellow shield | Requires Plan & Approve | `git push`, `helm install`, `kubectl apply` |
| **Dangerous** | Red triangle | Requires explicit confirmation | `docker rm`, `kubectl delete`, `terraform destroy` |

### Viewing Command Classifications

To see how commands are classified for any tool:

1. Go to **Settings > Local CLI**
2. Find an installed tool
3. Click **Commands** button
4. View all classified commands with safety badges

```
┌─────────────────────────────────────────────────────┐
│ kubectl Commands                                     │
├─────────────────────────────────────────────────────┤
│ 🟢 Read = Auto   🟡 Write = Plan & Approve          │
│ 🔴 Dangerous = Confirm                              │
├─────────────────────────────────────────────────────┤
│ 🟢 Read      kubectl get                            │
│ 🟢 Read      kubectl describe                       │
│ 🟢 Read      kubectl logs                           │
│ 🟡 Write     kubectl apply                          │
│ 🟡 Write     kubectl scale                          │
│ 🔴 Dangerous kubectl delete                         │
│ 🔴 Dangerous kubectl drain                          │
└─────────────────────────────────────────────────────┘
```

## Command Patterns

### Git Commands

| Classification | Commands |
|----------------|----------|
| **Read** | `status`, `log`, `diff`, `show`, `branch`, `remote`, `tag`, `ls-files`, `ls-remote`, `rev-parse` |
| **Write** | `add`, `commit`, `push`, `pull`, `fetch`, `merge`, `rebase`, `checkout`, `switch` |
| **Dangerous** | `reset`, `clean`, `push --force` |

### Docker Commands

| Classification | Commands |
|----------------|----------|
| **Read** | `ps`, `images`, `logs`, `inspect`, `stats`, `top`, `port`, `version`, `info` |
| **Write** | `build`, `run`, `pull`, `push`, `tag`, `start`, `stop`, `restart` |
| **Dangerous** | `rm`, `rmi`, `prune`, `system prune` |

### Kubectl Commands

| Classification | Commands |
|----------------|----------|
| **Read** | `get`, `describe`, `logs`, `top`, `explain`, `api-resources`, `api-versions`, `cluster-info`, `config view`, `config get-contexts`, `config current-context`, `version` |
| **Write** | `apply`, `create`, `patch`, `scale`, `rollout`, `label`, `annotate`, `set`, `expose`, `autoscale` |
| **Dangerous** | `delete`, `drain`, `cordon`, `uncordon`, `taint`, `exec` |

### Helm Commands

| Classification | Commands |
|----------------|----------|
| **Read** | `list`, `status`, `get`, `history`, `show`, `template`, `search`, `repo list`, `version` |
| **Write** | `install`, `upgrade`, `rollback`, `repo add`, `repo update` |
| **Dangerous** | `uninstall`, `repo remove` |

### Terraform Commands

| Classification | Commands |
|----------------|----------|
| **Read** | `show`, `state list`, `state show`, `output`, `validate`, `fmt`, `version`, `providers` |
| **Write** | `init`, `plan`, `apply`, `import`, `refresh` |
| **Dangerous** | `destroy`, `state rm`, `taint`, `untaint` |

## Security Features

### Shell Injection Prevention

All CLI tool execution includes protection against shell injection:

```
✅ Allowed:  kubectl get pods -n default
❌ Blocked:  kubectl get pods; rm -rf /
❌ Blocked:  kubectl get pods | cat /etc/passwd
❌ Blocked:  kubectl get $(whoami)
```

The following characters are blocked in arguments:
- `;` (command separator)
- `|` (pipe)
- `&` (background/and)
- `$` (variable expansion)
- `` ` `` (command substitution)
- `>`, `<` (redirects)

### Allowed Tools Whitelist

Only tools in the predefined registry can be executed. Users cannot execute arbitrary binaries, even if they're in PATH.

### Execution Timeout

All CLI commands have a default timeout (configurable) to prevent hanging operations.

## Integration with AI Modes

### Ask Mode

In Ask mode, only **read** commands are executed:

```
You: "Show me the running Docker containers"
AI: [Executes: docker ps]

    CONTAINER ID   IMAGE    STATUS
    abc123         nginx    Up 2 hours
    def456         redis    Up 1 hour
```

### Plan Mode

In Plan mode, **write** and **dangerous** commands go through Plan & Approve:

```
You: "Deploy the nginx image"
AI: I'll create an execution plan for this:

    📋 Execution Plan
    ─────────────────
    Step 1: docker pull nginx:latest
            Risk: Low (write operation)

    Step 2: docker run -d nginx:latest
            Risk: Medium (creates container)

    [Approve] [Reject]
```

## Best Practices

### For Developers

1. **Enable selectively** - Only enable tools you actively use
2. **Review commands** - Use the Commands viewer to understand classifications
3. **Start with Ask mode** - Gather information before making changes
4. **Trust the safety system** - Don't override classifications without reason

### For Teams

1. **Standardize tool versions** - Ensure consistent behavior across machines
2. **Document enabled tools** - Track which tools are enabled in shared environments
3. **Use GitOps for production** - Consider disabling Plan mode for prod clusters
4. **Audit activity logs** - Review AI tool execution history

### For Security

1. **Review new tools** - Understand classifications before enabling
2. **Don't bypass safety** - The classification system exists for your protection
3. **Update regularly** - Keep CLI tools updated for security patches
4. **Use RBAC** - Ensure proper Kubernetes permissions regardless of AI access

## Troubleshooting

### Tool Not Discovered

If a tool isn't showing up:

1. Verify the tool is in your PATH: `which <tool-name>`
2. Click **Refresh** in Local CLI settings
3. Ensure the tool is in the supported list (see above)
4. Check if the tool requires initialization (e.g., `gcloud init`)

### Command Failing

If a command fails:

1. Check the error message in AI Activity Log
2. Verify the tool works manually in terminal
3. Check tool-specific authentication (AWS credentials, kubectl context, etc.)
4. Review execution timeout settings

### Tool Working in Terminal but Not in KubeAgentics

1. Check if the tool is enabled in Local CLI settings
2. Verify the command isn't blocked by safety classification
3. Check for environment variables needed by the tool
4. Review the shell PATH differences

## Related

- [Guardrails Overview](../guardrails/overview.md) - Safety mechanisms
- [Command-Level Safety](../guardrails/command-safety.md) - Per-command classification details
- [Ask Mode](./ask-mode.md) - Read-only exploration
- [Plan & Approve Mode](./plan-mode.md) - Safe change execution
- [MCP Servers](../integrations/overview.md) - External tool integration
