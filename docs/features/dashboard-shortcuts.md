---
sidebar_position: 8
title: Dashboard Shortcuts
description: Auto-discover and quick-access your monitoring dashboards with one-click tunneling
---

# Dashboard Shortcuts

Instantly access your cluster's monitoring dashboards without manual port-forward commands or memorizing service endpoints.

## Overview

Dashboard Shortcuts automatically discovers monitoring services running in your Kubernetes cluster and creates quick-access links with automatic port-forwarding. Click once to connect—no terminal commands needed.

**Supported Services:**

| Category | Services |
|----------|----------|
| **Metrics** | Prometheus |
| **Alerting** | AlertManager |
| **Dashboards** | Grafana, Kubernetes Dashboard |
| **Logging** | Kibana |
| **Tracing** | Jaeger, Zipkin |
| **Service Mesh** | Kiali |
| **GitOps** | ArgoCD, Flux (Weave GitOps) |

:::info API-Only Services
Some observability backends like **Loki**, **Tempo**, and **Elasticsearch** are API-only services without built-in web UIs. These are discovered but not shown as shortcuts since they're accessed through other dashboards (Grafana for Loki/Tempo, Kibana for Elasticsearch).
:::

## How It Works

### Auto-Discovery

KubeAgentics scans your cluster for common monitoring services using standard naming conventions:

1. **Service Name Matching** - Checks for known service names like `prometheus-server`, `grafana`, `jaeger-query`
2. **Namespace Scanning** - Searches in common namespaces: `monitoring`, `observability`, `prometheus`, `grafana`, etc.
3. **Port Detection** - Identifies the correct service port for each tool

### Auto Port-Forwarding

When you click a shortcut:

1. **Tunnel Creation** - Creates a secure port-forward to the in-cluster service
2. **Port Allocation** - Automatically finds an available local port
3. **Tunnel Reuse** - Reuses existing tunnels if already active
4. **Browser Launch** - Opens the dashboard in your default browser

## Getting Started

### Discovering Services

1. Navigate to **Dashboard Shortcuts** in the sidebar (grid icon)
2. Click **Discover** in the top-right corner
3. Wait for the scan to complete (typically 5-10 seconds)
4. Discovered services appear as cards in the grid

### Opening a Dashboard

1. Find the service card (e.g., "Grafana")
2. Click **Open**
3. If not already connected, a tunnel is created automatically
4. Dashboard opens in your default browser

### Connection Status

Each shortcut card shows connection status:

- **Connected** (green) - Tunnel active, ready to use
- **In-Cluster** (gray) - Service found, tunnel not yet created

## Adding Manual Shortcuts

For external dashboards or custom services:

1. Click **Add** in the top-right corner
2. Fill in the shortcut details:
   - **Name** - Display name for the shortcut
   - **Category** - Type of service (metrics, logging, etc.)
   - **URL** - Dashboard URL (e.g., `https://grafana.example.com`)
3. Click **Save**

## Organizing Shortcuts

### Favorites

Star frequently-used shortcuts for quick access:

1. Click the star icon on any card
2. Use the **Favorites** filter tab to view only starred items

### Recent Access

The **Recent** filter shows your 10 most recently accessed dashboards, sorted by last access time.

## Workspace Scoping

Shortcuts are scoped to your current workspace:

- Each workspace maintains its own shortcuts
- Discovered services are specific to the cluster in your workspace
- Switching workspaces shows that workspace's shortcuts

## Discovery Configuration

### Supported Service Names

KubeAgentics searches for these common service names per tool:

**Prometheus:**
- `prometheus-server`, `prometheus-operated`, `kube-prometheus-stack-prometheus`, `prometheus-k8s`, `prometheus`

**Grafana:**
- `grafana`, `prom-grafana`, `kube-prometheus-stack-grafana`, `grafana-service`, `prometheus-grafana`

**AlertManager:**
- `alertmanager-main`, `alertmanager-operated`, `kube-prometheus-stack-alertmanager`, `alertmanager`

**Jaeger:**
- `jaeger-query`, `jaeger`, `jaeger-all-in-one`, `jaeger-operator-jaeger-query`, `simplest-query`

### Searched Namespaces

For each service, these namespaces are scanned:
- `monitoring`, `observability`, `prometheus`, `grafana`, `jaeger`, `tracing`, `logging`, `istio-system`, `kubernetes-dashboard`, `flux-system`, `default`

## Tips

### Port Conflicts

If a local port is already in use, KubeAgentics automatically finds the next available port starting from the service's default.

### Multiple Clusters

When switching clusters (via workspace or context), run **Discover** again to find services in the new cluster.

### Tunnel Cleanup

Tunnels remain active while KubeAgentics is running. They're automatically cleaned up on app exit or when you stop them from the Tunnels panel.

## Troubleshooting

### Service Not Discovered

If a known service isn't found:

1. **Check the service name** - May not match expected naming conventions
2. **Check the namespace** - Service might be in a custom namespace
3. **Add manually** - Create a manual shortcut with the correct URL

### Connection Failed

If opening a dashboard fails:

1. **Check pod status** - Ensure the service's pods are running
2. **Check port** - Verify the service port matches expectations
3. **Check RBAC** - Ensure your kubeconfig has permission to port-forward

### Dashboard Shows 404

This typically means:

1. **Wrong service port** - The service might expose multiple ports
2. **API-only service** - Services like Loki don't have web UIs (use Grafana instead)
3. **Application not ready** - The service might still be initializing
