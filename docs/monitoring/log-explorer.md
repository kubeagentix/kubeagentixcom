---
sidebar_position: 3
---

# Log Explorer

Search and analyze logs from Grafana Loki using LogQL queries.

## Features

- **LogQL Editor** - Full LogQL support with syntax highlighting
- **Time Range Selection** - Quick presets and custom ranges
- **Label Filtering** - Quick filters for namespace, pod, container
- **Log Level Highlighting** - Color-coded severity levels
- **Expandable Entries** - Click to view full log details and labels
- **Label Discovery** - Auto-complete for stream labels

## Prerequisites

Configure a Loki backend in **Settings > Logging**.

## Using the Explorer

### Basic Queries

LogQL queries start with a stream selector:

```logql
# All logs from a namespace
{namespace="production"}

# Logs from a specific pod
{pod="my-app-7d4c5b6f-x9k2z"}

# Logs from a container
{container="nginx"}
```

### Filtering Logs

Add line filters to search log content:

```logql
# Contains "error"
{namespace="production"} |= "error"

# Does not contain "debug"
{namespace="production"} != "debug"

# Regex match
{namespace="production"} |~ "failed|error|exception"

# Case-insensitive search
{namespace="production"} |~ "(?i)error"
```

### Parsing Logs

Extract fields from structured logs:

```logql
# JSON logs
{app="api"} | json

# Logfmt logs
{app="api"} | logfmt

# Pattern extraction
{app="nginx"} | pattern "<ip> - - [<timestamp>] \"<method> <path> <protocol>\" <status>"
```

### Filtering Parsed Fields

```logql
# Filter by parsed field
{app="api"} | json | level="error"

# Numeric comparison
{app="api"} | json | duration > 1000
```

## Time Range Selection

Select from preset ranges:

| Preset | Duration |
|--------|----------|
| 5m | Last 5 minutes |
| 15m | Last 15 minutes |
| 1h | Last hour |
| 6h | Last 6 hours |
| 24h | Last 24 hours |
| 7d | Last 7 days |
| 30d | Last 30 days |

## Log Entry Details

Click any log entry to expand and view:

- **Full message** - Complete log line without truncation
- **Labels** - All stream labels (namespace, pod, container, etc.)
- **Timestamp** - Precise log timestamp
- **Parsed fields** - If using JSON/logfmt parsing

## Quick Filters

Use the quick filter buttons to:

- Toggle label display on/off
- Filter by log level (info, warning, error)
- Toggle line wrapping

## Common Query Patterns

### Application Debugging

```logql
# Errors in production
{namespace="production"} |= "error" | json | level="error"

# Slow requests
{app="api"} | json | response_time > 1000

# Stack traces
{namespace="production"} |= "Exception" | json
```

### Infrastructure Logs

```logql
# Kubernetes events
{job="kubernetes-events"}

# Node system logs
{job="systemd"} |= "kubelet"

# Container startup logs
{container="init-container"}
```

### Security Auditing

```logql
# Authentication failures
{app="auth"} | json | event="login_failed"

# Admin actions
{app="api"} | json | user_role="admin"
```

## Label Discovery

The Log Explorer provides label auto-completion:

1. Click in the query editor
2. Type `{` to start a stream selector
3. Available labels appear in the dropdown
4. Select a label and press `=` to see values

## Performance Tips

### Limit Time Range

Start with shorter time ranges and expand if needed:

```logql
# Start with 15 minutes
{namespace="production"} |= "error"
```

### Use Specific Selectors

More specific selectors = faster queries:

```logql
# Slower - scans all pods
{namespace="production"} |= "error"

# Faster - targets specific app
{namespace="production", app="api"} |= "error"
```

### Limit Results

For large result sets, use `limit`:

```logql
# Return only 100 entries
{app="api"} | json | limit 100
```

## Authentication

Configure Loki authentication in **Settings > Logging**:

1. Add or edit a logging backend
2. Set authentication type:
   - **None** - No authentication
   - **Basic Auth** - Username and password
   - **Bearer Token** - For OAuth/OIDC
   - **API Key** - Custom header authentication

### Multi-Tenant Loki

For multi-tenant Loki deployments:

1. Edit your logging backend
2. Enter the **Tenant ID**
3. This sets the `X-Scope-OrgID` header
