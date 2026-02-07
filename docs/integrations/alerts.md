---
sidebar_position: 3
---

# Alerts Integration

Connect KubeAgentics to your alerting platform to monitor cluster health, view active alerts, and correlate issues with AI assistance.

## Supported Providers

| Provider | Authentication | Features |
|----------|---------------|----------|
| AlertManager | None / Basic Auth | View alerts, silences, groups |
| Grafana | API Key | Unified alerting, dashboards |
| PagerDuty | API Key | Incidents, escalations |
| OpsGenie | API Key | Alert management |
| VictorOps | API Key | Incident response |

## Setting Up AlertManager

AlertManager is the most common alerting backend for Kubernetes clusters running Prometheus.

### Prerequisites

Ensure you have AlertManager running in your cluster:

```bash
# Check if AlertManager is running
kubectl get pods -n monitoring -l app=alertmanager

# Port-forward to access AlertManager
kubectl port-forward -n monitoring svc/alertmanager 9093:9093
```

### Configure in KubeAgentics

1. Open KubeAgentics and navigate to **Settings**
2. Click the **Alerts** tab
3. Click **Add Backend**
4. Select **AlertManager** as the provider
5. Enter a name (e.g., "Production AlertManager")
6. Enter the URL:
   - Local/port-forwarded: `http://localhost:9093`
   - In-cluster: `http://alertmanager.monitoring.svc.cluster.local:9093`
7. Set authentication (usually **None** for in-cluster access)
8. Configure poll interval (default: 30 seconds)
9. Click **Test Connection** to verify
10. Click **Add** to save

### Authentication Options

#### No Authentication
Suitable for in-cluster or port-forwarded access:
- Select **None** for authentication type
- No additional configuration needed

#### Basic Authentication
If AlertManager is behind basic auth:
1. Select **Basic Auth**
2. Enter username
3. Enter password/token

#### Bearer Token
For OAuth or service account tokens:
1. Select **Bearer Token**
2. Enter your token

### Poll Interval

Configure how often KubeAgentics checks for new alerts:

| Interval | Use Case |
|----------|----------|
| 0 seconds | Manual refresh only |
| 15 seconds | Real-time monitoring |
| 30 seconds | Balanced (recommended) |
| 60+ seconds | Low-traffic environments |

## Setting Up Grafana Alerting

For teams using Grafana's unified alerting system.

### Step 1: Create a Service Account

1. In Grafana, go to **Administration > Service Accounts**
2. Click **Add service account**
3. Name it "KubeAgentics"
4. Set role to **Viewer** (or higher if you need to acknowledge alerts)
5. Click **Create**
6. Click **Add token**, name it, and copy the token

### Step 2: Configure in KubeAgentics

1. Navigate to **Settings > Alerts**
2. Click **Add Backend**
3. Select **Grafana** as the provider
4. Enter your Grafana URL (e.g., `https://grafana.example.com`)
5. Select **Bearer Token** for authentication
6. Paste your service account token
7. Test and save

## Using Alerts in KubeAgentics

Once configured, KubeAgentics provides:

### Alert Overview
- View all active alerts from connected backends
- Filter by severity (critical, warning, info)
- Search alerts by name or labels

### AI Correlation
Ask the AI about alerts:
- "What alerts are firing in the production namespace?"
- "Is this alert related to the recent deployment?"
- "What's the root cause of this PodCrashLoopBackOff alert?"

### Alert-to-RCA
Create an RCA investigation from an alert:
1. Click on an alert
2. Click "Investigate with AI"
3. The AI will analyze related resources and logs

## Credential Security

Alert backend credentials are stored in your system's secure keychain:

| Platform | Storage |
|----------|---------|
| macOS | Keychain Access |
| Windows | Windows Credential Manager |
| Linux | Secret Service API |

## Troubleshooting

### Connection Test Shows "No Active Alerts"

This is actually successful - it means:
1. Connection works
2. AlertManager responded
3. No alerts are currently firing (good news!)

### "Connection refused" Error

1. **Check the URL** - Verify the host and port
2. **Port forwarding** - If using port-forward, ensure it's running:
   ```bash
   kubectl port-forward -n monitoring svc/alertmanager 9093:9093
   ```
3. **Firewall** - Ensure no firewall is blocking the connection

### Authentication Errors

1. Verify credentials are correct
2. Check if your token has expired
3. Ensure the user/service account has read permissions

### Slow Response

If alerts are loading slowly:
1. Increase the poll interval to reduce load
2. Check AlertManager's performance
3. Consider filtering alerts by namespace/label

## API Reference

KubeAgentics uses these alert APIs:

- **AlertManager**: [AlertManager API v2](https://prometheus.io/docs/alerting/latest/clients/)
- **Grafana**: [Grafana HTTP API](https://grafana.com/docs/grafana/latest/developers/http_api/)
- **PagerDuty**: [PagerDuty REST API](https://developer.pagerduty.com/api-reference/)

## Best Practices

### Multiple Backends

You can configure multiple alert backends for different environments:
- Production AlertManager
- Staging AlertManager
- Grafana for unified view

Set one as the **default** for quick access.

### Integration with Monitoring Context

The Monitoring context in KubeAgentics can use alert data to:
- Show alert counts in the sidebar
- Correlate alerts with resource issues
- Provide AI suggestions based on alert patterns
