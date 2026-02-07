---
sidebar_position: 2
title: Multi-Tenant Architecture
description: Workspace-scoped data isolation for MSP/SI multi-client deployments
---

# Multi-Tenant Architecture

KubeAgentics' workspace architecture is designed specifically for MSP/SI partners managing multiple clients. Each workspace provides complete data isolation while allowing cross-workspace visibility for partner administrators.

## Workspace Isolation Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MSP/SI PARTNER MULTI-TENANT MODEL                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PARTNER ADMINISTRATOR VIEW                                          ││
│  │ ┌────────────┐ Toggle: [All Workspaces] / [Current Workspace]       ││
│  │ │ Global View │ → See all client data for SLA reporting            ││
│  │ └────────────┘                                                      ││
│  └─────────────────────────────────────────────────────────────────────┘│
│           │                                                              │
│           ▼                                                              │
│  ┌───────────────┬───────────────┬───────────────┬───────────────┐     │
│  │  WORKSPACE A  │  WORKSPACE B  │  WORKSPACE C  │  WORKSPACE D  │     │
│  │  Client: HDFC │  Client: ICICI│  Client: Axis │  Client: Kotak│     │
│  ├───────────────┼───────────────┼───────────────┼───────────────┤     │
│  │ • RCA History │ • RCA History │ • RCA History │ • RCA History │     │
│  │ • Exec History│ • Exec History│ • Exec History│ • Exec History│     │
│  │ • Flow History│ • Flow History│ • Flow History│ • Flow History│     │
│  │ • Cost Analysis│ • Cost Analysis│ • Cost Analysis│ • Cost Analysis│  │
│  │ • Clusters    │ • Clusters    │ • Clusters    │ • Clusters    │     │
│  └───────────────┴───────────────┴───────────────┴───────────────┘     │
│                                                                          │
│  DATA ISOLATION GUARANTEES:                                              │
│  ✓ All records tagged with workspaceId                                  │
│  ✓ Cluster context tracked for audit trail                              │
│  ✓ Automatic data scoping on workspace switch                           │
│  ✓ Cross-workspace view requires explicit toggle                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Scoping

All historical data is workspace-scoped with full audit trail:

### Data Records with Audit Context

| Data Type | Workspace Scoping | Audit Fields |
|-----------|-------------------|--------------|
| **RCA Reports** | workspaceId, clusterContext | savedAt, source, feedbackRating |
| **Execution History** | workspaceId, clusterContext | startedAt, completedAt, status |
| **Flow Executions** | workspaceId, cluster, namespace | nodeStates, durationMs, logs |
| **Cost Analysis** | analysisWorkspaceId, analysisClusterContext | estimatedAt, migrationTarget |

### RCA Report Schema

```typescript
interface SavedRcaReport {
  id: string;

  // Workspace Isolation (MSP/SI Multi-tenant)
  workspaceId: string;        // Client workspace identifier
  clusterContext?: string;    // Specific cluster for audit trail

  // RCA Content
  resourceKind: string;
  resourceName: string;
  namespace?: string;
  rootCause: string;
  markdown: string;           // Full RCA report
  confidence: number;         // AI confidence score

  // Audit Trail
  savedAt: string;            // ISO timestamp
  source: 'quick-dx' | 'scan' | 'manual';

  // Feedback Loop
  feedbackRating?: 'positive' | 'negative';
  feedbackComment?: string;
}
```

## Cross-Workspace Visibility

MSP/SI partners often need to view all clients' data for:
- SLA compliance reporting
- Cross-client issue pattern detection
- Resource utilization trends
- Billing and invoicing

### "All Workspaces" Toggle

Each history view includes a toggle for partner administrators:

```
┌─────────────────────────────────────────────────────────────────────┐
│ RCA History                                              12 reports │
│                                                                     │
│  [Globe] All Workspaces / [Layers] Current Workspace: HDFC         │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Search by resource, namespace, root cause...                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  • Pod/api-gateway in production       2h ago    Quick Dx   85%   │
│    Workspace: HDFC                                                 │
│                                                                     │
│  • Deployment/checkout-service in prod  5h ago    Scan      72%   │
│    Workspace: ICICI                                                │
│                                                                     │
│  • StatefulSet/mongodb in data          1d ago    Quick Dx   91%  │
│    Workspace: Axis                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Automatic Data Isolation

When a partner user switches workspaces, the following data is automatically cleared or filtered:

1. **Resource data cleared** - Pods, deployments, services refreshed
2. **Dashboard context reset** - Start fresh in new client context
3. **Visualization cleared** - No cross-contamination
4. **History filtered** - Shows only current workspace unless toggled
5. **Cost analysis checked** - Stale analysis flagged if from different workspace

### Implementation

```typescript
// useWorkspaceSync hook behavior
useEffect(() => {
  if (workspaceChanged) {
    clearResources();           // Clear pod/deployment data
    resetDashboard();           // Reset to default context
    clearVisualization();       // Clear any open visualizations
    clearTopology();            // Clear topology graph
    resetArgoCd();              // Reset ArgoCD state
    clearCostAnalysis();        // Clear workspace-specific cost data
  }
}, [activeWorkspaceId]);
```

## Client Onboarding

When onboarding a new client:

1. **Create workspace** - Unique identifier, display name, description
2. **Configure clusters** - Add client's Kubernetes clusters
3. **Set up integrations** - Connect monitoring, GitOps, ticketing
4. **Deploy Packs** - Install relevant industry Packs
5. **Configure alerts** - Set up SLA thresholds

### Workspace Configuration

```yaml
# Example workspace configuration
workspace:
  id: hdfc-bank-prod
  name: HDFC Bank Production
  description: Production environment for HDFC core banking

  clusters:
    - id: hdfc-gke-mumbai
      context: gke_hdfc-prod_asia-south1_prod-cluster
      region: ap-south-1
    - id: hdfc-gke-dr
      context: gke_hdfc-dr_asia-south2_dr-cluster
      region: ap-south-2

  packs:
    - banking-rca-pack
    - rbi-compliance-pack
    - core-banking-integration

  compliance:
    dataRetention: 7y
    auditLevel: detailed
    regulations:
      - RBI
      - SEBI
```

## Best Practices

### For Optimal Data Isolation

1. **One workspace per client** - Never mix client data
2. **Use descriptive names** - Include client name and environment
3. **Document cluster mappings** - Track which clusters belong to which workspace
4. **Regular audits** - Verify data isolation periodically
5. **Train team members** - Ensure understanding of workspace switching

### For SLA Management

1. **Use "All Workspaces" view** - For cross-client SLA dashboards
2. **Export reports regularly** - Generate per-workspace compliance reports
3. **Set up alerts** - Configure per-workspace SLA thresholds
4. **Track MTTR** - Use execution history duration metrics
