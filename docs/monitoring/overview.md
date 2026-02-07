---
sidebar_position: 1
---

# Monitoring Overview

KubeAgentics provides a comprehensive monitoring dashboard that brings together metrics, logs, alerts, and events in a unified interface.

## Dashboard Views

The Monitoring context menu in the sidebar provides access to:

| View | Description |
|------|-------------|
| **Overview** | Dashboard summary with key metrics and health indicators |
| **Metrics Explorer** | PromQL query interface for Prometheus metrics |
| **Log Explorer** | LogQL query interface for Loki logs |
| **Live Tail** | Real-time log streaming with filters |
| **Active Alerts** | Current firing alerts from AlertManager |
| **Alert Rules** | Configured alerting rules from Prometheus |
| **Silences** | Manage AlertManager silences |
| **Events** | Kubernetes cluster events |

## Quick Access

Access monitoring views from the sidebar:

1. Click the **Monitoring** section in the sidebar
2. Expand to see available views
3. Click any view to open it in the main panel

## Backend Requirements

For full monitoring functionality, you need:

- **Prometheus/VictoriaMetrics** - Metrics collection and storage
- **Grafana Loki** - Log aggregation and storage
- **Prometheus AlertManager** - Alert routing and management

Configure backends in **Settings > Metrics**, **Settings > Logging**, and **Settings > Alerts**.

## AI Integration

All monitoring views integrate with the AI assistant:

- Ask about specific metrics or logs
- Get explanations for alerts
- Request RCA investigations from alert context
- Correlate events with resource issues

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KubeAgentics Desktop                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Metrics   │  │    Logs     │  │       Alerts        │  │
│  │   Backend   │  │   Backend   │  │      Backend        │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │             │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────────┴──────────┐  │
│  │ Prometheus  │  │  Loki API   │  │  AlertManager API   │  │
│  │   Adapter   │  │   Adapter   │  │      Adapter        │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
    ┌─────┴─────┐    ┌─────┴─────┐    ┌────────┴────────┐
    │Prometheus │    │   Loki    │    │  AlertManager   │
    │ Server    │    │  Server   │    │     Server      │
    └───────────┘    └───────────┘    └─────────────────┘
```
