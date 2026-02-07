---
sidebar_position: 5
---

# Active Alerts

View and manage active alerts from Prometheus AlertManager.

## Features

- **Real-time Alert View** - See all currently firing alerts
- **Severity Filtering** - Filter by critical, warning, info
- **State Filtering** - Filter by firing, pending, silenced
- **Search** - Find alerts by name or labels
- **Alert Details** - View full alert information
- **Quick Actions** - Silence, view in AlertManager, investigate

## Prerequisites

Configure an AlertManager backend in **Settings > Alerts**.

## Alert States

| State | Description | Icon |
|-------|-------------|------|
| **Firing** | Alert condition is currently true | Red bell |
| **Pending** | Alert condition true but under threshold | Yellow clock |
| **Silenced** | Alert matched by a silence | Purple muted bell |
| **Inhibited** | Suppressed by another alert | Gray bell |

## Alert Severities

| Severity | Description |
|----------|-------------|
| **Critical** | Requires immediate attention |
| **Warning** | Should be investigated soon |
| **Info** | Informational, no action required |

## Using Active Alerts

### Viewing Alerts

1. Navigate to **Monitoring > Active Alerts**
2. See a summary of alert counts by severity
3. Browse the list of active alerts
4. Click any alert to expand details

### Filtering Alerts

Use the filter controls:

- **Severity dropdown** - Show all, critical, warning, or info
- **State dropdown** - Show all, firing, pending, silenced
- **Search box** - Filter by alert name or label values

### Alert Details

Click an alert to view:

- **Summary** - Alert description from annotations
- **Labels** - All labels attached to the alert
- **Annotations** - Additional context (runbook URL, description)
- **Duration** - How long the alert has been firing
- **Affected Resource** - Linked Kubernetes resource

### Quick Actions

From the alert detail view:

| Action | Description |
|--------|-------------|
| **Silence** | Create a silence for this alert |
| **View in AlertManager** | Open alert in AlertManager UI |
| **Investigate** | Start an RCA investigation |
| **View Resource** | Navigate to affected K8s resource |

## Alert Grouping

Alerts can be grouped by:

- **Alertname** - All instances of the same alert
- **Namespace** - Alerts from the same namespace
- **Severity** - Group by critical/warning/info

## Integration with AI

Ask the AI about alerts:

- "What alerts are currently firing?"
- "Why is the HighMemoryUsage alert triggered?"
- "What should I do about this PodCrashLoopBackOff alert?"
- "Are there any related alerts to this issue?"

## Common Alert Patterns

### Resource Alerts

```
HighCPUUsage - CPU usage above threshold
HighMemoryUsage - Memory usage above threshold
PodCrashLoopBackOff - Pod repeatedly crashing
NodeNotReady - Node is not healthy
```

### Application Alerts

```
HighErrorRate - Too many HTTP 5xx errors
HighLatency - Request latency above threshold
QueueBacklog - Processing queue too large
```

### Infrastructure Alerts

```
DiskSpaceRunningLow - Disk space below threshold
CertificateExpiringSoon - TLS cert expiring
ETCDNoLeader - etcd cluster has no leader
```

## Auto-Refresh

Alerts are automatically refreshed:

- Default interval: 30 seconds
- Click **Refresh** for immediate update
- Disable auto-refresh in settings

## Silencing from Active Alerts

Quick silence creation:

1. Click an alert
2. Click **Silence**
3. Configure duration (30m, 1h, 2h, etc.)
4. Add a comment explaining why
5. Click **Create**

This creates a silence matching the alert's labels.

## Troubleshooting

### "No alerts found"

This usually means:
1. No alerts are currently firing (good!)
2. AlertManager connection is working
3. Check Alert Rules to see configured alerts

### Alerts not updating

1. Check AlertManager connection in Settings
2. Verify AlertManager is running
3. Check poll interval setting

### Missing silenced alerts

By default, silenced alerts may be filtered:
1. Change state filter to **All**
2. Or select **Silenced** to see only silenced alerts
