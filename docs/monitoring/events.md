---
sidebar_position: 8
---

# Events Viewer

Monitor Kubernetes cluster events to understand what's happening in your cluster.

## Features

- **Real-time Events** - View events from the Kubernetes API
- **Type Filtering** - Filter Normal vs Warning events
- **Search** - Find events by message, reason, or object
- **Auto-refresh** - Stay updated with latest events
- **Event Details** - Expand for full event information

## What are Kubernetes Events?

Events are records of things that happened in the cluster:

- Pod scheduling and startup
- Container creation and termination
- Volume mounting
- Node conditions
- Resource scaling
- Errors and warnings

## Event Types

| Type | Description | Count |
|------|-------------|-------|
| **Normal** | Expected operations (scheduling, pulling images) | Usually high |
| **Warning** | Issues that may need attention | Should be low |

## Using Events Viewer

### Viewing Events

1. Navigate to **Monitoring > Events**
2. Events are sorted newest first
3. Click an event to expand details
4. Events refresh automatically

### Filtering

**By Type**:
- **All** - Show all events
- **Normal** - Show only normal events
- **Warning** - Show only warning events

**By Search**:
- Search by message content
- Search by reason (e.g., "Pulled", "Created")
- Search by object name

### Event Details

Click an event to see:

| Field | Description |
|-------|-------------|
| **Namespace** | Where the event occurred |
| **Object Kind** | Pod, Node, Deployment, etc. |
| **Object Name** | The affected resource |
| **Reason** | Why the event occurred |
| **Message** | Detailed description |
| **First Seen** | When event first occurred |
| **Last Seen** | Most recent occurrence |
| **Count** | How many times it repeated |

## Common Event Reasons

### Normal Events

| Reason | Meaning |
|--------|---------|
| `Scheduled` | Pod assigned to a node |
| `Pulled` | Container image pulled |
| `Created` | Container created |
| `Started` | Container started |
| `Killing` | Container being terminated |
| `ScalingReplicaSet` | Deployment scaling |

### Warning Events

| Reason | Meaning |
|--------|---------|
| `BackOff` | Container restart backoff |
| `Failed` | Operation failed |
| `FailedScheduling` | Pod can't be scheduled |
| `FailedMount` | Volume mount failed |
| `Unhealthy` | Liveness/readiness probe failed |
| `NodeNotReady` | Node is not healthy |

## Troubleshooting with Events

### Pod Not Starting

Look for events with these reasons:
- `FailedScheduling` - No nodes available
- `Failed` - Container creation failed
- `BackOff` - Container keeps crashing

### Volume Issues

Look for:
- `FailedMount` - Volume couldn't be mounted
- `FailedAttachVolume` - Storage attachment failed

### Network Issues

Look for:
- `NetworkNotReady` - CNI not configured
- `FailedCreatePodSandBox` - Network setup failed

### Resource Constraints

Look for:
- `FailedScheduling` with "Insufficient cpu/memory"
- `OOMKilling` - Out of memory

## Auto-Refresh

Events auto-refresh every 30 seconds when enabled.

Toggle auto-refresh:
- Click the **Auto-refresh** button
- Green = enabled
- Gray = disabled

## Namespace Scope

Events are filtered by the currently selected namespace:

- Switch namespaces using the workspace selector
- Events update to show the new namespace
- Use "all namespaces" to see cluster-wide events

## Integration with AI

Ask the AI about events:

- "What events are happening in production?"
- "Why is this pod showing Warning events?"
- "Summarize recent events for the api deployment"
- "Are there any concerning events in the cluster?"

## Event Retention

Kubernetes retains events for a limited time (default: 1 hour):

- Very old events are automatically deleted
- Use a monitoring system for long-term event storage
- Consider using event exporters for persistence

## Tips

### Finding Related Events

Events include the object they relate to:

1. Find an event for a Pod
2. Note the object name
3. Search for that name
4. See all related events

### Correlating with Logs

Events and logs together tell the full story:

1. Find a Warning event
2. Note the timestamp and object
3. Switch to Log Explorer
4. Query logs for that time and object

### Watching Deployments

Monitor events during deployments:

1. Start a deployment
2. Open Events Viewer
3. Watch for:
   - `ScalingReplicaSet`
   - `Scheduled`
   - `Pulled`
   - `Started`

If you see `BackOff` or `Failed`, investigate immediately.
