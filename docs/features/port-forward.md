---
sidebar_position: 5
---

# Port Forwarding

Access your Kubernetes services and pods directly from your local machine without exposing them publicly.

## Overview

Port Forwarding creates a secure tunnel from your local machine to a pod or service running in your Kubernetes cluster. This is equivalent to `kubectl port-forward` but with a visual interface to manage multiple tunnels.

## How to Use

### Starting a Port Forward

1. **Navigate to Pods or Services** - Click "Pods" or "Services" in the sidebar
2. **Right-click a Resource** - Find the pod or service you want to forward and right-click on it
3. **Select "Port Forward..."** - Choose "Port Forward..." from the context menu
4. **Configure Ports** - The dialog opens with:
   - **Local Port** - The port on your machine (auto-detected to find an available port)
   - **Remote Port** - The port on the pod/service (auto-detected from the resource spec)
5. **Click "Start Forward"** - The tunnel starts and appears in the Tunnels tab

### Smart Port Detection

KubeAgentics automatically detects the correct port to forward:

1. **From Pod Spec** - Checks container port definitions
2. **From Associated Services** - If no port in pod spec, looks for services that select this pod
3. **Default Fallback** - Uses port 8080 if no port information is found

### Managing Active Tunnels

Click the **Tunnels icon** (network icon with badge) in the terminal toolbar to see all active port forwards:

- **Status Indicator** - Green dot = active, red dot = failed
- **Copy URL** - Click the copy button to copy `http://localhost:<port>` to clipboard
- **Open in Browser** - Click the external link button to open in your default browser
- **Stop Forward** - Click the stop button to terminate the tunnel

## Use Cases

### Local Development

Forward a database or API service to develop against:

```
Pod: postgres-abc123 → localhost:5432
Service: api-gateway → localhost:8080
```

### Debugging

Access internal services that aren't exposed externally:

```
Pod: redis-master → localhost:6379
Service: internal-metrics → localhost:9090
```

### Testing

Test services before exposing them:

```
Service: new-feature-service → localhost:3000
```

## Layout Integration

### 2-Panel Mode Badge

When you're in 2-panel mode (terminal hidden) and have active port forwards:
- A **green badge** appears on the 3-panel layout button showing the count of active forwards
- Click the badge to switch to 3-panel mode and see your tunnels

### Tunnels Tab

The Tunnels tab in the terminal area shows:
- All active port forwards
- Resource name and namespace
- Local and remote port mapping
- Quick action buttons (copy, open, stop)

## Tips

### Finding Available Ports

KubeAgentics automatically finds an available local port starting from the suggested remote port. If port 8080 is in use, it will try 8081, 8082, etc.

### Multiple Forwards

You can have multiple port forwards active simultaneously. Each appears in the Tunnels list with its own controls.

### Forwarding to Services vs Pods

- **Service Forwarding** - More stable; continues working if pods restart (Kubernetes routes to healthy pods)
- **Pod Forwarding** - Direct access to a specific pod; useful when debugging a particular instance

## Troubleshooting

### Port Already in Use

If you see "Port X is already in use", the suggested local port is occupied. Either:
- Change the local port number manually
- Stop other applications using that port
- Let auto-detection find another available port

### Connection Refused

The remote service might not be running or listening on the specified port. Check:
- Pod is in "Running" state
- Container has started successfully
- Application is listening on the expected port

### Forward Stops Unexpectedly

This can happen if:
- The pod restarts or is deleted
- Network connectivity is lost
- The Kubernetes API server connection drops

Try stopping and restarting the port forward.
