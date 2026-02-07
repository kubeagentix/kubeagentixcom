---
sidebar_position: 2
---

# Metrics Explorer

Query and visualize Prometheus metrics directly from KubeAgentics using PromQL.

## Features

- **PromQL Editor** - Full PromQL support with syntax highlighting
- **Time Range Selection** - Quick presets (5m, 1h, 24h, 7d) and custom ranges
- **Query History** - Recent queries saved locally for quick access
- **Table & Chart Views** - Toggle between tabular data and line charts
- **Query Sharing** - Copy queries to clipboard

## Prerequisites

Configure a Prometheus or VictoriaMetrics backend in **Settings > Metrics**.

## Using the Explorer

### Writing Queries

Enter PromQL expressions in the query editor:

```promql
# CPU usage by pod
sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Memory usage percentage
(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100

# HTTP request rate
rate(http_requests_total[5m])
```

### Time Range Selection

Select from preset time ranges:

| Preset | Duration |
|--------|----------|
| 5m | Last 5 minutes |
| 15m | Last 15 minutes |
| 1h | Last hour |
| 6h | Last 6 hours |
| 24h | Last 24 hours |
| 7d | Last 7 days |
| 30d | Last 30 days |

### Viewing Results

Toggle between views:

- **Table View** - Raw metric values with labels
- **Chart View** - Time series line chart

### Query History

Recent queries are automatically saved:

1. Click the **History** button
2. Browse recent queries
3. Click a query to load it
4. Use the trash icon to remove entries

## Common Queries

### Resource Metrics

```promql
# Pod CPU usage
sum(rate(container_cpu_usage_seconds_total{pod!=""}[5m])) by (pod, namespace)

# Pod memory usage
sum(container_memory_usage_bytes{pod!=""}) by (pod, namespace)

# Node CPU usage
1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance)

# Node memory available
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
```

### Network Metrics

```promql
# Network receive rate by pod
sum(rate(container_network_receive_bytes_total[5m])) by (pod)

# Network transmit rate by pod
sum(rate(container_network_transmit_bytes_total[5m])) by (pod)
```

### Application Metrics

```promql
# Request latency p99
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Error rate
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

## Tips

### Use Aggregations

Aggregate metrics to reduce cardinality:

```promql
# Instead of showing all containers
container_cpu_usage_seconds_total

# Aggregate by pod
sum by (pod) (container_cpu_usage_seconds_total)
```

### Rate for Counters

Always use `rate()` or `irate()` for counter metrics:

```promql
# Correct - shows requests per second
rate(http_requests_total[5m])

# Incorrect - shows ever-increasing counter value
http_requests_total
```

### Filter Early

Apply label filters to reduce data volume:

```promql
# Filter to specific namespace
sum(container_memory_usage_bytes{namespace="production"}) by (pod)
```

## Authentication

When your Prometheus server requires authentication:

1. Go to **Settings > Metrics**
2. Edit your backend configuration
3. Select authentication type:
   - **None** - No authentication
   - **Basic Auth** - Username and password
   - **Bearer Token** - OAuth or service account token

Credentials are stored securely in your system keychain.
