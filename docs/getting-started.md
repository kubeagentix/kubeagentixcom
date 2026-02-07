---
sidebar_position: 1
---

# Getting Started

Welcome to KubeAgentics - your AI-powered Kubernetes desktop companion.

## Installation

### Download

Download the latest release for your platform from the [Releases page](https://github.com/kubeagentics/kubeagentics-ce/releases).

### Prerequisites

- A working Kubernetes cluster (local or remote)
- `kubectl` configured with access to your cluster
- Kubeconfig file accessible

## Quick Start

1. **Launch KubeAgentics** - Open the application after installation

2. **Connect to your cluster** - KubeAgentics automatically detects your kubeconfig

3. **Configure AI Provider** - Go to Settings > AI Configuration and set up your preferred LLM provider

4. **Start chatting** - Ask questions about your cluster in natural language

## First Steps

### Viewing Resources

Navigate through your cluster resources using the sidebar:
- Namespaces
- Workloads (Deployments, StatefulSets, DaemonSets)
- Pods and their logs
- Services and ConfigMaps

### Pod Shell & Port Forwarding

Right-click on pods or services for quick actions:
- **[Open Shell](/docs/features/pod-exec)** - Interactive shell access to containers
- **[Port Forward](/docs/features/port-forward)** - Create tunnels to access services locally

### AI Chat

Use the AI chat to:
- Ask questions about your cluster state
- Get explanations of Kubernetes concepts
- Troubleshoot issues with AI assistance
- Generate runbooks for common operations

### Integrations

Enhance KubeAgentics with external integrations:
- **[Issue Tracking](/docs/integrations/issue-tracking)** - Connect to Jira or GitHub Issues
- **[Alerts](/docs/integrations/alerts)** - Connect to AlertManager or Grafana

## Next Steps

- Configure [Issue Tracking](/docs/integrations/issue-tracking) to create tickets from RCA reports
- Set up [Alerts](/docs/integrations/alerts) to monitor your cluster health
- Explore [AI Chat features](/docs/features/ai-chat)
