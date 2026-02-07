---
sidebar_position: 4
---

# Live Tail

Stream logs in real-time from your Kubernetes cluster using Grafana Loki.

## Features

- **Real-time Streaming** - Logs appear as they're generated
- **Auto-scroll** - Automatically scrolls to newest entries
- **Search Filter** - Filter visible entries by text
- **Level Filter** - Show only specific log levels
- **Pause/Resume** - Pause streaming to analyze logs
- **Clear Buffer** - Clear the log buffer to start fresh

## Prerequisites

Configure a Loki backend in **Settings > Logging**.

## Starting a Live Tail

1. Navigate to **Monitoring > Live Tail**
2. Enter a LogQL stream selector:
   ```logql
   {namespace="production"}
   ```
3. Click the **Play** button to start streaming
4. Logs appear in real-time as they're generated

## Controls

| Button | Action |
|--------|--------|
| **Play** | Start or resume streaming |
| **Pause** | Pause streaming (keeps buffer) |
| **Clear** | Clear all buffered entries |

## Filtering

### Text Search

Filter displayed entries by text content:

1. Enter text in the search field
2. Only matching entries are shown
3. Streaming continues in the background

### Level Filter

Filter by log level:

- **All** - Show all entries
- **Info** - Show info and above
- **Warning** - Show warning and above
- **Error** - Show errors only

### Query Selector

Refine what logs are streamed:

```logql
# Specific application
{app="api", namespace="production"}

# Multiple containers
{pod=~"frontend-.*"}

# Exclude noisy logs
{namespace="production"} != "health check"
```

## Auto-Scroll

When enabled (default), the view automatically scrolls to show new entries.

Toggle auto-scroll:
- Click the **Arrow Down** button
- Or scroll up to pause auto-scroll
- Scrolling to bottom re-enables auto-scroll

## Buffer Management

Live Tail maintains a buffer of recent entries:

- **Default size**: 500 entries
- Oldest entries are removed when buffer is full
- Use **Clear** to empty the buffer

## Performance Considerations

### High-Volume Logs

For applications generating many logs:

1. Use specific selectors to reduce volume
2. Add line filters in the query:
   ```logql
   {app="api"} |= "error"
   ```
3. Consider using Log Explorer for historical analysis

### Network Bandwidth

Live Tail streams data continuously:

- Each entry is transmitted as it arrives
- Poll interval is 2 seconds by default
- Consider pausing when not actively monitoring

## Use Cases

### Debugging Live Issues

Stream logs while reproducing an issue:

```logql
{pod="my-app-7d4c5b6f-x9k2z"}
```

### Monitoring Deployments

Watch logs during a deployment:

```logql
{namespace="production", app="api"}
```

### Tracking Specific Events

Stream only relevant entries:

```logql
{app="api"} |= "order_placed"
```

### Watching Errors

Monitor for errors in real-time:

```logql
{namespace="production"} | json | level="error"
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Toggle play/pause |
| Escape | Stop streaming |
| ↓ | Scroll to bottom / Enable auto-scroll |

## Tips

### Combine with AI

While streaming, you can ask the AI about patterns:

- "What's causing these errors?"
- "Is this log volume normal?"
- "Summarize the recent activity"

### Save Queries

Common queries can be saved:

1. Write your query
2. Copy to clipboard
3. Save in your notes or runbook

### Multiple Streams

Open multiple Live Tail views:

1. Use the **+** button to add a panel
2. Run different queries in each
3. Compare logs side-by-side
