---
sidebar_position: 3
title: Plan & Approve (Legacy)
description: Redirects to SafeExec Mode
---

# Plan & Approve Mode

:::info Renamed to SafeExec Mode

Plan & Approve mode has been enhanced and renamed to **SafeExec Mode** with Intelligent Query Routing.

**Key improvements:**
- Read queries now execute **instantly** without generating plans
- Write operations still require approval (as before)
- 10-100x token savings on most queries
- Near-instant responses for simple operations

[**Go to SafeExec Mode documentation →**](./safe-exec-mode.md)

:::

## What Changed?

| Before (Plan Mode) | After (SafeExec Mode) |
|--------------------|----------------------|
| All queries generated plans | Only write queries generate plans |
| Slow for simple reads | Instant read execution |
| High token usage | Minimal token usage |
| Same UX for everything | Smart routing based on intent |

## Migration

No action required. SafeExec mode is a drop-in replacement that provides:

1. **Same safety** - Write operations still require approval
2. **Better speed** - Read operations are instant
3. **Lower costs** - Less AI tokens consumed

The UI shows "SafeExec" instead of "Plan" in the mode selector.
