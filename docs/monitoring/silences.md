---
sidebar_position: 7
---

# Silences

Manage AlertManager silences to temporarily suppress alert notifications.

## Features

- **View Silences** - See all active, pending, and expired silences
- **Create Silences** - Create new silences with matchers
- **Expire Silences** - End a silence before its scheduled time
- **Matcher Editor** - Visual builder for silence matchers

## Prerequisites

Configure an AlertManager backend in **Settings > Alerts**.

## What is a Silence?

A silence is a way to mute alerts for a specific period:

- **Matchers** define which alerts to silence (by labels)
- **Duration** defines how long the silence lasts
- **Comment** explains why the silence was created
- **Creator** tracks who created it

## Silence States

| State | Description |
|-------|-------------|
| **Active** | Currently silencing matching alerts |
| **Pending** | Scheduled to start in the future |
| **Expired** | No longer active |

## Creating a Silence

1. Navigate to **Monitoring > Silences**
2. Click **New Silence**
3. Add matchers (label filters)
4. Select duration
5. Enter your name and a comment
6. Click **Create**

### Matcher Types

| Type | Symbol | Example |
|------|--------|---------|
| **Equal** | `=` | `alertname=HighCPUUsage` |
| **Not Equal** | `!=` | `severity!=info` |
| **Regex** | `=~` | `pod=~frontend-.*` |

### Duration Presets

| Duration | Use Case |
|----------|----------|
| 30 minutes | Quick investigation |
| 1 hour | Short maintenance |
| 2 hours | Standard maintenance |
| 4 hours | Extended work |
| 24 hours | Overnight silence |
| 7 days | Long-term suppression |

## Common Silence Patterns

### Silence a Specific Alert

Silence all instances of an alert:

```
Matcher: alertname = HighCPUUsage
```

### Silence Alerts for a Pod

During pod maintenance:

```
Matcher: pod = my-app-7d4c5b6f-x9k2z
```

### Silence by Namespace

During namespace maintenance:

```
Matcher: namespace = staging
```

### Silence Severity

Suppress info alerts during incident:

```
Matcher: severity = info
```

### Regex Matching

Silence a group of pods:

```
Matcher: pod =~ frontend-.*
```

## Managing Silences

### View Active Silences

The Silences page shows:

- **Matchers** - What alerts are matched
- **Time remaining** - When silence expires
- **Creator** - Who created the silence
- **Comment** - Why it was created

### Expire a Silence Early

To end a silence before expiration:

1. Find the silence in the list
2. Click the **Expire** button (trash icon)
3. Confirm the action

The silence immediately stops matching alerts.

### Filter Silences

Use filters to find silences:

- **State** - Active, pending, or expired
- **Search** - By creator or comment text

## Silence from Alert

Create a silence directly from an alert:

1. Go to **Active Alerts**
2. Click an alert
3. Click **Silence**
4. Matchers are pre-filled from alert labels
5. Adjust duration and add comment
6. Click **Create**

## Best Practices

### Always Add Comments

Explain why you're creating the silence:

```
Deploying new version - CPU spike expected for ~30 minutes
```

### Use Specific Matchers

More specific = fewer unintended silences:

```
# Too broad - silences all namespace alerts
namespace = production

# Better - silences specific alert in namespace
alertname = HighMemoryUsage
namespace = production
pod = api-server-1
```

### Set Appropriate Duration

- Start with shorter duration
- Extend if needed
- Don't use 7 days for quick fixes

### Track Silences

Review active silences regularly:
- Expired silences may indicate resolved issues
- Long-running silences may need investigation

## Troubleshooting

### Silence Not Working

Check that matchers exactly match alert labels:

1. View the alert's labels
2. Compare to silence matchers
3. Remember that `=` requires exact match

### Silence Expired Early

Verify:
1. End time was set correctly
2. No one manually expired it
3. AlertManager was not restarted (clears state)

### Cannot Create Silence

1. Check AlertManager connection
2. Verify write permissions
3. Ensure matchers are valid

## API Details

Silences use AlertManager's v2 API:

- **List**: `GET /api/v2/silences`
- **Create**: `POST /api/v2/silences`
- **Expire**: `DELETE /api/v2/silence/{id}`
