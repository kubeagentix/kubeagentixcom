---
sidebar_position: 2
---

# Root Cause Analysis (RCA)

KubeAgentics provides AI-powered Root Cause Analysis to help you understand and resolve Kubernetes issues quickly.

## Overview

RCA mode investigates failing or problematic resources by:

1. Collecting logs, events, and metrics
2. Analyzing patterns and correlations
3. Identifying the root cause
4. Suggesting remediation steps

## Starting an RCA

### From a Resource

1. Select a resource in the sidebar (Pod, Deployment, etc.)
2. Click the **RCA** button in the detail panel
3. Or right-click and select "Run RCA"

### From the Chat

1. Select a resource context
2. Ask: "Why is this pod failing?"
3. The AI will start an RCA investigation

## RCA Process

### Step 1: Data Collection

KubeAgentics gathers:
- Pod logs (current and previous containers)
- Kubernetes events
- Resource status and conditions
- Related resources (services, configmaps, secrets metadata)
- Metrics (if Prometheus is configured)

### Step 2: Analysis

The AI analyzes:
- Error patterns in logs
- Event sequences
- Resource constraints
- Configuration issues
- Dependency problems

### Step 3: Report Generation

A structured RCA report includes:
- **Summary**: Brief overview of the issue
- **Root Cause**: Identified cause with confidence level
- **Evidence**: Supporting data from logs and events
- **Impact**: Affected resources and users
- **Remediation**: Step-by-step fix instructions
- **Prevention**: How to avoid recurrence

## Creating Issues from RCA

After an RCA completes:

1. Click **Create Issue** in the report
2. Select your issue tracking backend (GitHub, Jira)
3. Choose the repository/project
4. Review the auto-generated content
5. Click Create

This creates a ticket with:
- RCA summary as the title
- Full analysis in the description
- Relevant labels and metadata

## Saving RCA Reports

RCA reports are automatically saved and can be:
- Viewed later in the RCA history
- Exported as markdown
- Attached to runbooks
- Linked to issues

## Best Practices

- Run RCA on the most specific resource (Pod > Deployment)
- Provide context about when the issue started
- Review the evidence before accepting conclusions
- Use the "Ask follow-up" feature to dig deeper
