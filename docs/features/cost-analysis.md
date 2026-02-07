---
sidebar_position: 10
---

# Cost Analysis

KubeAgentics provides cost analysis and cloud migration estimates to help you understand resource costs and make informed decisions about cloud platforms.

## Overview

The Cost Analysis feature helps you:

- **Estimate cloud migration costs** with real instance-based pricing
- **Compare providers** (AWS EKS, Azure AKS, DigitalOcean DOKS)
- **Right-size workloads** by identifying over-provisioned resources
- **Find unused resources** that can be cleaned up
- **Plan migrations** from self-hosted to managed Kubernetes

## Accessing Cost Analysis

Navigate to **Cost Analysis** in the sidebar under the Dashboards section, or use the Cost mode in the Agentic Panel.

## Cloud Migration Estimates

### Instance-Based Pricing

Unlike simple per-CPU calculators, KubeAgentics matches your actual resource usage to real cloud instance types:

| Provider | Instance Matching | Control Plane | Best For |
|----------|------------------|---------------|----------|
| **DigitalOcean DOKS** | Droplet catalog (20+ types) | Free | Budget-conscious, MVPs |
| **AWS EKS** | EC2 catalog (36+ types) | $73/mo | Enterprise, AWS ecosystem |
| **Azure AKS** | VM catalog (24+ types) | Free | Microsoft ecosystem |
| **Self-hosted** | EC2-based estimate | N/A | Full control |

### How It Works

1. **Analyzes actual usage** from metrics-server (not just requests/limits)
2. **Matches to real instances** (e.g., t3a.medium, B2s, s-2vcpu-4gb)
3. **Calculates total cost** including compute, storage, and control plane
4. **Shows breakdown** so you know exactly what you're paying for

### Example Output

```
Cloud Migration Cost Estimate (instance-based pricing)

DigitalOcean DOKS          AWS EKS                Azure AKS
1x Basic 2 vCPU, 4 GB      1x t3a.medium          1x B2s
$24/mo                     $100/mo                $30/mo
├─ Compute: $24            ├─ Compute: $27        ├─ Compute: $30
├─ Storage: $0             ├─ Storage: $0         ├─ Storage: $0
└─ Control Plane: Free     └─ Control Plane: $73  └─ Control Plane: Free
```

## What's Included

### Included in Estimates

| Resource | Description |
|----------|-------------|
| **Compute (CPU)** | vCPU/cores based on actual usage |
| **Compute (Memory)** | RAM based on actual usage |
| **Block Storage** | PersistentVolumeClaims |
| **Control Plane** | Managed K8s service fee |

### NOT Included

These vary by usage and should be estimated separately:

- Managed databases (RDS, Cloud SQL)
- Object storage (S3, GCS, Spaces)
- Network egress
- Load balancers
- Container registries
- Managed services (SQS, Lambda, etc.)

## Right-Sizing Recommendations

KubeAgentics identifies over-provisioned resources by comparing actual usage to requests:

- **CPU underutilization**: Using less than 20% of requested CPU
- **Memory underutilization**: Using less than 25% of requested memory

Each recommendation includes:
- Current vs. recommended resource requests
- Estimated monthly savings
- Risk assessment
- Severity level (low/medium/high)

## Unused Resource Detection

Find orphaned or idle resources:

| Resource | Detection Criteria |
|----------|-------------------|
| Services | No endpoints |
| PVCs | Not mounted by any pod |
| Deployments | Zero replicas |
| Pods | Zero traffic for extended period |

## Configuration

### Cloud Provider

Select your target cloud provider:
- AWS EKS
- GCP GKE
- Azure AKS
- Local/Dev (Kind, Minikube)
- On-Prem
- Custom Rates

### Analysis Window

Choose the time period for usage analysis:
- 7 days
- 14 days
- 30 days (recommended)

### Show Equivalent Cloud Cost

For local/on-prem clusters, toggle this to see what your workload would cost on cloud providers.

## Choosing the Right Platform

### For MVPs and Startups

**Recommended: DigitalOcean DOKS**

- Free control plane saves $73/mo vs AWS EKS
- Simple, predictable pricing
- Easy to migrate later

### For Enterprise

**Consider AWS EKS or Azure AKS when:**

- You need IAM, VPC integration, compliance features
- You're invested in the AWS/Azure ecosystem
- You need advanced networking (service mesh, etc.)

### Cost Comparison

```
Small workload (1 vCPU, 2GB RAM):
  DOKS: ~$12/mo
  EKS:  ~$80/mo ($73 control plane + $7 compute)
  AKS:  ~$15/mo

Medium workload (4 vCPU, 16GB RAM):
  DOKS: ~$48/mo
  EKS:  ~$194/mo
  AKS:  ~$121/mo
```

## Ask About Costs

Use AI-powered insights by clicking suggested questions or typing your own:

- "Which namespace is using the most resources?"
- "What would I save moving to DigitalOcean?"
- "Are there any over-provisioned workloads?"
- "Compare managed vs self-hosted K8s costs"

## Export

Export analysis results as:
- **CSV** for spreadsheets
- **JSON** for programmatic analysis

## Tips

1. **Enable metrics-server** for accurate usage data
2. **Right-size before migrating** to avoid paying for waste
3. **Factor in databases** when planning total cloud budget
4. **Consider egress costs** for high-traffic applications
5. **Start with DOKS for MVPs** - often 3-4x cheaper than EKS
