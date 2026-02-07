---
sidebar_position: 4
title: Pack Development
description: Building and selling industry-specific Packs
---

# Pack Development Guide

Build industry-specific Packs to create recurring revenue and differentiate your services.

## Why Pack Development is Lucrative

### The Revenue Math

```
Traditional Consulting:
  1 engineer × 1 client × 1 month = $2K revenue

Pack Development:
  1 pack × 100 clients × $100/mo = $10K/mo recurring
  After 1 year = $120K/year from ONE pack
  Build 10 packs = $1.2M/year RECURRING
```

### Revenue Share Model

| Your Revenue Share | Requirements |
|-------------------|--------------|
| **80%** | Certified Partner, verified publisher |
| **85%** | Premier Partner, 5+ packs, $10K+ revenue |
| **90%** | Strategic Partner, custom agreement |

## Pack Development Kit (PDK)

### Getting Started

```bash
# Install Pack Development Kit
npm install -g @kubepilot/pdk

# Create new pack
kubepilot-pack init banking-rca-pack

# Structure created:
banking-rca-pack/
├── pack.yaml              # Pack manifest
├── tools/                 # Rust → WASM tools
│   └── src/
│       ├── lib.rs
│       └── banking_checks.rs
├── ui/                    # React UI panels
│   └── src/
│       ├── CompliancePanel.tsx
│       └── RCADashboard.tsx
├── workflows/             # YAML workflows
│   ├── rbi-compliance-check.yaml
│   └── core-banking-rca.yaml
├── runbooks/              # Runbook templates
│   └── incident-response.yaml
└── docs/
    └── README.md

# Build pack
kubepilot-pack build

# Test locally
kubepilot-pack dev

# Submit for review
kubepilot-pack submit

# Publish to marketplace (after approval)
kubepilot-pack publish
```

### Pack Manifest

```yaml
# pack.yaml for Banking RCA Pack
apiVersion: kubepilot.io/v1
kind: Pack
metadata:
  name: banking-rca-pack
  version: 2.1.0
  author: YourCompany
  authorId: your-company-id  # Verified publisher
  license: commercial

  marketplace:
    published: true
    pricing:
      type: subscription
      price: 299
      currency: USD
      interval: monthly
    categories: [bfsi, compliance, rca]
    tags: [banking, rbi, core-banking, fintech]
    description: |
      Comprehensive RCA and compliance pack for banking sector.

      Features:
      - RBI compliance automated checks
      - Core banking system integration
      - Transaction tracing
      - Automated incident classification
      - Pre-built runbooks for common issues

  requiredEdition: plus

spec:
  displayName: Banking Operations & RCA Pack

  components:
    tools:
      - id: banking.rbiComplianceCheck
        name: RBI Compliance Check
        description: Automated RBI circular compliance verification
        wasm: tools/rbi-compliance.wasm

      - id: banking.transactionTrace
        name: Transaction Trace
        description: Trace transactions across services
        wasm: tools/transaction-trace.wasm

    workflows:
      - id: banking.rbiAudit
        name: RBI Audit Workflow
        file: workflows/rbi-audit.yaml

    ui-panels:
      - id: banking.complianceDashboard
        name: Compliance Dashboard
        bundle: ui/compliance.js

    runbook-templates:
      - id: banking.coreDowntime
        name: Core Banking Downtime Response
        file: runbooks/core-downtime.yaml
```

## Tool Development (Rust → WASM)

Tools are written in Rust and compiled to WebAssembly for secure, sandboxed execution.

### Example: Compliance Check Tool

```rust
// tools/src/rbi_compliance.rs

use kubepilot_sdk::{Tool, ToolResult, K8sClient};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct ComplianceResult {
    pub compliant: bool,
    pub checks: Vec<ComplianceCheck>,
    pub recommendations: Vec<String>,
}

#[derive(Serialize)]
pub struct ComplianceCheck {
    pub rule: String,
    pub status: String,
    pub details: String,
}

/// RBI Compliance Check Tool
#[kubepilot_sdk::tool]
pub async fn rbi_compliance_check(
    k8s: &K8sClient,
    namespace: String,
) -> ToolResult<ComplianceResult> {
    let mut checks = Vec::new();
    let mut compliant = true;

    // Check 1: Data residency - pods must be in India region
    let pods = k8s.list_pods(&namespace).await?;
    for pod in &pods {
        if !is_india_region(&pod.node) {
            compliant = false;
            checks.push(ComplianceCheck {
                rule: "RBI/2018-19/153 - Data Localization".into(),
                status: "FAIL".into(),
                details: format!("Pod {} running outside India", pod.name),
            });
        }
    }

    // Check 2: Encryption at rest
    let secrets = k8s.list_secrets(&namespace).await?;
    for secret in &secrets {
        if !secret.is_encrypted {
            compliant = false;
            checks.push(ComplianceCheck {
                rule: "RBI/DPSS/2021 - Encryption".into(),
                status: "FAIL".into(),
                details: format!("Secret {} not encrypted", secret.name),
            });
        }
    }

    Ok(ComplianceResult {
        compliant,
        checks,
        recommendations: generate_recommendations(&checks),
    })
}
```

## UI Panel Development (React)

Create custom UI panels using React and the Pack UI kit.

### Example: Compliance Dashboard

```tsx
// ui/src/ComplianceDashboard.tsx

import React from 'react';
import { usePackTool, Panel, Card, Badge, Table } from '@kubepilot/pack-ui';

export function ComplianceDashboard() {
  const { data, loading, error, refresh } = usePackTool('banking.rbiComplianceCheck', {
    namespace: 'production',
  });

  if (loading) return <Panel.Loading />;
  if (error) return <Panel.Error error={error} />;

  return (
    <Panel title="RBI Compliance Status" onRefresh={refresh}>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <Card.Title>Overall Status</Card.Title>
          <Badge variant={data.compliant ? 'success' : 'error'}>
            {data.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
          </Badge>
        </Card>

        <Card>
          <Card.Title>Checks Passed</Card.Title>
          <span className="text-2xl font-bold text-green-600">
            {data.checks.filter(c => c.status === 'PASS').length}
          </span>
          <span className="text-zinc-500"> / {data.checks.length}</span>
        </Card>
      </div>

      <Table
        title="Compliance Checks"
        columns={[
          { key: 'rule', title: 'Rule' },
          { key: 'status', title: 'Status', render: (v) => (
            <Badge variant={v === 'PASS' ? 'success' : 'error'}>{v}</Badge>
          )},
          { key: 'details', title: 'Details' },
        ]}
        data={data.checks}
      />
    </Panel>
  );
}
```

## Workflow Development (YAML)

Define automated workflows using YAML.

### Example: Daily Audit Workflow

```yaml
# workflows/rbi-audit.yaml

name: RBI Compliance Audit
description: Comprehensive RBI compliance check across all namespaces

trigger:
  schedule: "0 6 * * *"  # Daily at 6 AM
  manual: true

inputs:
  - name: namespaces
    type: array
    default: ["production", "uat", "dr"]

  - name: sendReport
    type: boolean
    default: true

steps:
  - id: compliance-check
    name: Run Compliance Checks
    tool: banking.rbiComplianceCheck
    forEach: ${inputs.namespaces}
    input:
      namespace: ${item}

  - id: aggregate-results
    name: Aggregate Results
    tool: core.aggregate
    input:
      results: ${steps.compliance-check.results}

  - id: generate-report
    name: Generate Audit Report
    tool: core.generateReport
    input:
      template: rbi-audit-report
      data: ${steps.aggregate-results.output}
      format: pdf

  - id: notify
    name: Send Notifications
    condition: ${inputs.sendReport}
    tool: core.notify
    input:
      channels: ["email", "slack"]
      subject: "Daily RBI Compliance Report"
      attachments:
        - ${steps.generate-report.output.reportPath}
```

## Pack Ideas by Industry

| Industry | Pack Idea | Target Clients | Pricing |
|----------|-----------|----------------|---------|
| **Banking/BFSI** | RBI Compliance RCA Pack | 50+ banks | $299/mo |
| **Banking/BFSI** | Core Banking K8s Pack | 50+ banks | $499/mo |
| **Insurance** | IRDAI Audit Pack | 60+ insurers | $199/mo |
| **Telecom** | Network RCA Pack | 10+ telcos | $999/mo |
| **Retail** | E-commerce Peak Pack | 500+ retailers | $99/mo |
| **Healthcare** | HIPAA Compliance Pack | 200+ hospitals | $149/mo |
| **Manufacturing** | IoT/Edge K8s Pack | 100+ manufacturers | $249/mo |

## Publishing Process

1. **Development** - Build and test locally
2. **Submission** - Submit for marketplace review
3. **Review** - KubeAgentics team reviews for quality
4. **Approval** - Pack approved and listed
5. **Go Live** - Available in marketplace
6. **Revenue** - Monthly revenue share payments
