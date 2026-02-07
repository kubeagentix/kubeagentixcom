---
sidebar_position: 4
---

# Pod Exec (Shell Access)

Connect directly to your running containers with interactive shell access - no command line required.

## Overview

Pod Exec allows you to open an interactive shell session into any running container in your Kubernetes cluster, similar to running `kubectl exec -it <pod> -- /bin/bash`. This is essential for debugging, inspecting container state, and troubleshooting issues in real-time.

## How to Use

### Opening a Shell

1. **Navigate to Pods** - Click "Pods" in the sidebar to view pods in the current namespace
2. **Right-click a Pod** - Find the pod you want to access and right-click on it
3. **Select "Open Shell"** - Choose "Open Shell" from the context menu
4. **Select Container** (if multiple) - If the pod has multiple containers, a dialog will appear asking you to select which container to connect to
5. **Start Using the Shell** - A new terminal tab opens with your shell session

### Terminal Features

- **Multiple Sessions** - Open multiple shell sessions to different pods simultaneously using terminal tabs
- **Full PTY Support** - Full terminal emulation with proper escape sequences, colors, and cursor movement
- **Auto Shell Detection** - Automatically tries `/bin/bash` first, falls back to `/bin/sh` if bash isn't available
- **Session Persistence** - Your shell sessions stay active while the app is running

## Tips

### Best Practices

- **Use for debugging** - Shell access is great for inspecting logs, checking file contents, and running diagnostic commands
- **Check running processes** - Use `ps aux` to see what's running in the container
- **Inspect environment** - Use `env` to see environment variables
- **Check connectivity** - Use `curl` or `wget` to test network connectivity from within the container

### Common Commands

```bash
# Check running processes
ps aux

# View environment variables
env

# Check disk usage
df -h

# View running container's filesystem
ls -la /app

# Check network connectivity
curl -v http://other-service:8080/health
```

## Layout Behavior

When you open a shell session:
- If you're in **2-panel mode** (terminal hidden), the layout automatically switches to **3-panel mode** to show the terminal
- The new shell tab is automatically focused

## Limitations

- **Running pods only** - You can only exec into running pods
- **Container must have shell** - The container must have a shell binary (`/bin/bash` or `/bin/sh`)
- **Pod readiness** - Some pods may not be ready for exec immediately after starting

## Troubleshooting

### "Container not found" error
Make sure you've selected a valid container name. If the pod was recently restarted, try refreshing the pod list.

### Shell exits immediately
The container might not have an interactive shell. Try a different container or check if the container is configured correctly.

### Connection dropped
Network issues between your machine and the cluster can cause drops. Check your kubectl connectivity with `kubectl cluster-info`.
