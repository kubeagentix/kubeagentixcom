---
title: Logs Backends
description: Configure Loki, Elasticsearch, and OpenSearch for centralized logging
sidebar_position: 5
---

# Logs Backend Configuration

KubeAgentics supports multiple log aggregation backends for centralized logging in your Kubernetes clusters.

## Supported Backends

| Backend | Description | Query Language | Live Tail |
|---------|-------------|----------------|-----------|
| **Grafana Loki** | Horizontally-scalable log aggregation by Grafana | LogQL | Yes |
| **Elasticsearch** | Distributed search and analytics engine | Lucene / KQL | No |
| **AWS OpenSearch** | AWS-managed search service (Elasticsearch fork) | OpenSearch DSL / SQL | No |

## Configuration

### Accessing Logs Settings

1. Navigate to **Global Settings** (gear icon in sidebar)
2. Select the **Logs** tab
3. Click **Add Backend** to configure a new logging backend

### Grafana Loki

Loki is recommended for Kubernetes-native logging with its tight integration with Grafana.

```yaml
# Example Loki configuration
endpoint: http://loki.monitoring.svc:3100
authentication: none  # or basic, bearer
tenantId: ""  # for multi-tenant deployments
```

**Features:**
- LogQL query language
- Live tail support
- Label-based log selection
- Multi-tenant support

### Elasticsearch

Elasticsearch provides powerful full-text search capabilities for log analysis.

```yaml
# Example Elasticsearch configuration
endpoint: https://elasticsearch.logging.svc:9200
authentication: basic  # or api_key, bearer
indexPattern: "logs-*"
timeField: "@timestamp"
```

**Features:**
- Lucene query syntax
- Index pattern matching
- Field mapping support
- Aggregations support

### AWS OpenSearch

OpenSearch (AWS-managed Elasticsearch fork) provides a fully managed search service.

```yaml
# Example OpenSearch configuration
endpoint: https://opensearch.us-east-1.es.amazonaws.com
authentication: basic  # or api_key
indexPattern: "logs-*"
timeField: "@timestamp"
messageField: "message"
```

**Features:**
- OpenSearch SQL support
- AWS integration
- Index lifecycle management
- Snapshot and restore

## Auto-Discovery

KubeAgentics can automatically discover logging services in your cluster.

1. Go to **Global Settings** > **Logs**
2. Click **Discover**
3. Select from discovered services

### Discovery Namespaces

Auto-discovery scans these namespaces:
- `monitoring`
- `logging`
- `observability`
- `elastic-system`
- `opensearch`
- `elk`
- `default`

### Service Detection

The following service names are detected:

**Loki:**
- `loki`
- `loki-gateway`
- `loki-stack`
- `loki-distributed-gateway`

**Elasticsearch:**
- `elasticsearch`
- `elasticsearch-es-http`
- `elastic-elasticsearch`

**OpenSearch:**
- `opensearch`
- `opensearch-cluster-master`
- `opensearch-master`

## Workspace Scoping

Logs backends support workspace-level configuration:

- **Global Settings**: Default backends for all workspaces
- **Workspace Settings**: Override backends per workspace

This allows teams to use different logging backends for different environments or projects.

## Query Examples

### LogQL (Loki)

```logql
# All logs from production namespace
{namespace="production"}

# Filter by container
{namespace="production", container="nginx"}

# Search for errors
{namespace="production"} |= "error"

# Parse JSON and filter
{namespace="production"} | json | level="error"

# Rate of errors per minute
rate({namespace="production"} |= "error" [1m])
```

### Lucene (Elasticsearch/OpenSearch)

```lucene
# Search by level
level:error

# Search by namespace
kubernetes.namespace_name:production

# Combined search
level:error AND kubernetes.namespace_name:production

# Wildcard search
message:*timeout*

# Range query
@timestamp:[now-1h TO now]
```

## Security

### Authentication Methods

| Method | Use Case |
|--------|----------|
| **None** | In-cluster access without auth |
| **Basic Auth** | Username/password authentication |
| **API Key** | Token-based access (Elasticsearch) |
| **Bearer Token** | OAuth/JWT authentication |

### Secure Storage

Credentials are stored securely:
- macOS: System Keychain
- Windows: Windows Credential Manager
- Linux: Secret Service API

### Best Practices

- Use HTTPS endpoints in production
- Create read-only service accounts
- Leverage Kubernetes network policies
- Rotate credentials regularly

## Troubleshooting

### Connection Issues

1. Verify endpoint URL accessibility
2. Check authentication credentials
3. Ensure service is running (`kubectl get svc -n monitoring`)
4. Test with `curl` from a pod in the cluster

### Query Performance

1. Reduce time range for large datasets
2. Add specific filters to queries
3. Increase timeout in backend settings
4. Check backend resource utilization

### Missing Logs

1. Verify log shipper configuration (Fluent Bit, Fluentd)
2. Check index pattern matches log indices
3. Verify timestamp field configuration
4. Check ingestion pipeline health
