---
sidebar_position: 6
---

# Alert Rules

View and understand the alerting rules configured in your Prometheus instance.

## Features

- **Rule Groups** - View rules organized by group/file
- **Rule States** - See which rules are firing, pending, or inactive
- **PromQL Expressions** - View the query behind each rule
- **Alert Instances** - See active alert instances per rule
- **Health Status** - Check rule evaluation health

## Prerequisites

Configure a Prometheus/AlertManager backend in **Settings > Alerts** or **Settings > Metrics**.

Alert rules are fetched from Prometheus's `/api/v1/rules` endpoint.

## Understanding Alert Rules

### Rule Groups

Rules are organized into groups:

```yaml
groups:
  - name: kubernetes-apps
    rules:
      - alert: KubePodNotReady
        expr: ...
      - alert: KubePodCrashLooping
        expr: ...
```

Each group has:
- **Name** - Group identifier
- **File** - Source file (if using file-based config)
- **Interval** - How often rules are evaluated

### Rule Components

| Component | Description |
|-----------|-------------|
| **Name** | Alert name (e.g., `HighCPUUsage`) |
| **Expression** | PromQL query that triggers the alert |
| **Duration** | How long condition must be true (e.g., `5m`) |
| **Labels** | Static labels added to alerts |
| **Annotations** | Summary, description, runbook URL |

## Rule States

| State | Color | Meaning |
|-------|-------|---------|
| **Firing** | Red | Alert condition is true |
| **Pending** | Yellow | Condition true but under `for` duration |
| **Inactive** | Gray | Condition is false |

## Using Alert Rules

### Browsing Rules

1. Navigate to **Monitoring > Alert Rules**
2. See all rule groups listed
3. Expand a group to see its rules
4. Click a rule to see details

### Rule Details

For each rule, view:

- **PromQL Expression** - The query that evaluates the condition
- **Duration** - The `for` clause (how long before firing)
- **Labels** - Labels added to generated alerts
- **Annotations** - Descriptions and runbook links
- **Active Alerts** - Currently firing instances

### Filtering Rules

- **State filter** - Show all, firing, pending, or inactive
- **Search** - Filter by rule name
- **Group filter** - Show rules from specific groups

### Health Status

Rules show their health status:

| Health | Meaning |
|--------|---------|
| **OK** | Rule evaluating normally |
| **Error** | Rule has evaluation errors |
| **Unknown** | Status not determined |

Check **Evaluation Time** to see if rules are taking too long.

## Example Rules

### Pod Health

```yaml
alert: KubePodCrashLooping
expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
for: 15m
labels:
  severity: warning
annotations:
  summary: Pod {{ $labels.pod }} is crash looping
```

### Node Resources

```yaml
alert: NodeMemoryPressure
expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.1
for: 5m
labels:
  severity: critical
annotations:
  summary: Node {{ $labels.instance }} has less than 10% memory available
```

### Application Metrics

```yaml
alert: HighErrorRate
expr: |
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m])) > 0.05
for: 5m
labels:
  severity: warning
annotations:
  summary: Error rate is above 5%
```

## Understanding the PromQL

Click the **View Expression** button to see the full PromQL:

```promql
sum by (namespace, pod) (
  rate(container_cpu_usage_seconds_total[5m])
) > 0.8
```

This query:
1. Takes CPU usage rate over 5 minutes
2. Sums by namespace and pod
3. Alerts when usage exceeds 80%

## Actions

From the rule detail view:

| Action | Description |
|--------|-------------|
| **Test Query** | Run the PromQL in Metrics Explorer |
| **View Alerts** | See active alerts for this rule |
| **Copy Expression** | Copy PromQL to clipboard |

## Modifying Rules

Alert rules are defined in Prometheus configuration files or recording rules. To modify:

1. Edit your Prometheus rule files
2. Reload Prometheus configuration:
   ```bash
   kubectl exec -n monitoring prometheus-0 -- kill -HUP 1
   ```
3. Rules will update in KubeAgentics on next refresh

## Troubleshooting

### Rule Shows Error

Check the error message for:
- **Invalid PromQL** - Syntax error in expression
- **Missing metric** - Referenced metric doesn't exist
- **Timeout** - Query takes too long to evaluate

### Rule Never Fires

Verify:
1. The PromQL returns results in Metrics Explorer
2. The `for` duration has elapsed
3. No silences are matching the alert

### Rules Not Updating

1. Check Prometheus connection
2. Verify Prometheus is reloading configuration
3. Rules API may be cached (wait a few minutes)
