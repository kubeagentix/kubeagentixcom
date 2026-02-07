---
sidebar_position: 1
---

# Integrations Overview

KubeAgentics supports external integrations to enhance your Kubernetes management workflow. Connect to issue tracking systems and alerting platforms to create a seamless DevOps experience.

## Available Integrations

### Issue Tracking

Connect to popular issue tracking systems to create and manage tickets directly from KubeAgentics:

- **GitHub Issues** - Track issues in your GitHub repositories
- **Jira** - Enterprise issue tracking with Atlassian Jira
- **GitLab Issues** - Issue tracking for GitLab projects
- **Linear** - Modern project management
- **Azure DevOps** - Microsoft's work item tracking

[Learn more about Issue Tracking](/docs/integrations/issue-tracking)

### Alerting

Monitor your cluster health by connecting to alerting platforms:

- **AlertManager** - Prometheus AlertManager integration
- **Grafana** - Grafana alerting system
- **PagerDuty** - Incident response platform
- **OpsGenie** - Alert management service
- **VictorOps** - Incident management

[Learn more about Alerts](/docs/integrations/alerts)

## Security

All credentials are stored securely using your system's native keychain:
- **macOS** - Keychain Access
- **Windows** - Windows Credential Manager
- **Linux** - Secret Service API (GNOME Keyring / KDE Wallet)

Credentials are never stored in plain text and are encrypted at rest.

## Configuration

Navigate to **Settings** in KubeAgentics to configure integrations:

1. Click the gear icon in the sidebar or use the keyboard shortcut
2. Select the **Issue Tracking** or **Alerts** tab
3. Click **Add Backend** to configure a new integration
4. Enter your credentials and test the connection
5. Save the configuration

Each integration can be enabled/disabled independently, and you can set a default backend for each category.
