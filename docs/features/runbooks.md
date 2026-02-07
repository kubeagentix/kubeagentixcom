---
sidebar_position: 3
---

# Runbooks

KubeAgentics supports runbook creation, storage, and execution to standardize operational procedures.

## Overview

Runbooks are documented procedures for:
- Incident response
- Routine maintenance
- Deployment procedures
- Troubleshooting guides

## Creating Runbooks

### From RCA

After completing an RCA:
1. Click **Generate Runbook** in the RCA report
2. Review the AI-generated steps
3. Edit as needed
4. Save to the runbook library

### From Scratch

1. Navigate to the Runbooks panel
2. Click **New Runbook**
3. Enter title and description
4. Add steps with:
   - Description
   - Commands
   - Expected outcomes
   - Rollback procedures

### AI-Assisted

Ask the AI to generate a runbook:
- "Create a runbook for scaling this deployment"
- "Generate a procedure for database backup"

## Runbook Structure

A runbook includes:

```yaml
title: Scale Web Application
description: Procedure to scale the web application horizontally
category: Operations
tags: [scaling, deployment, production]

steps:
  - name: Verify current state
    description: Check current replica count
    command: kubectl get deployment web-app -o jsonpath='{.spec.replicas}'

  - name: Scale deployment
    description: Increase replicas to desired count
    command: kubectl scale deployment web-app --replicas=5

  - name: Verify scaling
    description: Confirm new pods are running
    command: kubectl get pods -l app=web-app
    expected: "5 pods in Running state"

  - name: Rollback if needed
    description: Revert to original count if issues
    command: kubectl scale deployment web-app --replicas=3
```

## Executing Runbooks

### Step-by-Step

1. Open a runbook
2. Click **Execute**
3. Each step shows:
   - Description
   - Command to run
   - Execute button
   - Result display
4. Progress through steps manually

### With AI Guidance

Enable AI guidance for:
- Command explanations
- Expected vs actual comparison
- Troubleshooting if a step fails
- Suggested modifications

## Runbook Library

### Organizing

Runbooks can be:
- Categorized (Operations, Incident Response, etc.)
- Tagged for searchability
- Versioned with change history

### Sharing

Export runbooks as:
- Markdown files
- YAML definitions
- Shareable links (coming soon)

## Integration with RCA

Runbooks integrate with RCA:
- Link runbooks to common issues
- Auto-suggest relevant runbooks during incidents
- Track runbook usage in reports

## Best Practices

- Keep runbooks focused on single procedures
- Include rollback steps for critical operations
- Test runbooks in non-production first
- Update runbooks after incidents reveal gaps
- Include expected outcomes for verification
