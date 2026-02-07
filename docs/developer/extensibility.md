---
sidebar_position: 4
---

# Extensibility System

KubeAgentics is designed for growth. The pack and feature registry system allows adding new capabilities without code changes.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXTENSIBILITY ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ Pack Registry    │    │ Feature Registry │                   │
│  │ (Code + DB)      │    │ (Code + DB)      │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌──────────────────────────────────────────┐                   │
│  │           Edition Access Control          │                   │
│  │    CE → LTD/Pro → Team → Enterprise      │                   │
│  └─────────────────────┬────────────────────┘                   │
│                        │                                         │
│           ┌────────────┴────────────┐                           │
│           ▼                         ▼                            │
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │ Server API      │      │ Desktop App     │                   │
│  │ /api/v1/packs   │      │ Enforcement     │                   │
│  │ /api/v1/features│      │ Lock UI         │                   │
│  └─────────────────┘      └─────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Pack Registry

### Adding a New Pack

Packs can be added in two ways:

#### 1. Code-Based (Immediate)

Add to `apps/server/lib/packs/registry.ts`:

```typescript
// In PACK_REGISTRY array
{
  id: 'my-new-pack',
  name: 'My New Pack',
  description: 'Description of what this pack does',
  category: 'monitoring',  // core | monitoring | cloud | security | premium | partner
  icon: 'chart',
  version: '1.0.0',
  minEdition: 'ltd',       // Minimum edition required
  editions: ['ltd', 'pro', 'team', 'enterprise'],  // Explicit edition list
  features: ['feature-1', 'feature-2'],
  requires: ['prometheus'], // Dependencies
  metadata: {
    tags: ['metrics', 'visualization'],
  },
}
```

#### 2. Database-Based (Dynamic)

Insert into `pack_definitions` table:

```sql
INSERT INTO pack_definitions (
  pack_id, name, description, category, min_edition, editions, features
) VALUES (
  'my-new-pack',
  'My New Pack',
  'Description of what this pack does',
  'monitoring',
  'ltd',
  ARRAY['ltd', 'pro', 'team', 'enterprise'],
  ARRAY['feature-1', 'feature-2']
);
```

### Pack Categories

| Category | Description | Typical Access |
|----------|-------------|----------------|
| `core` | Essential Kubernetes features | CE+ |
| `monitoring` | Observability tools | LTD/Pro+ |
| `cloud` | Cloud provider integrations | LTD/Pro+ |
| `security` | Security and compliance | Team+ |
| `premium` | Advanced enterprise features | Team/Enterprise |
| `partner` | Third-party integrations | Varies |

## Feature Registry

### Adding a New Feature

```typescript
// In FEATURE_REGISTRY array
{
  id: 'my-new-feature',
  name: 'My New Feature',
  description: 'What this feature does',
  category: 'ai',  // ai | collaboration | integrations | advanced
  minEdition: 'pro',
  editions: ['pro', 'team', 'enterprise'],
  packId: 'my-pack',  // Optional: tie to a pack
  comingSoon: false,  // Set true for unreleased features
}
```

### Feature Categories

| Category | Description |
|----------|-------------|
| `ai` | AI-powered capabilities |
| `collaboration` | Team features |
| `integrations` | External service integrations |
| `advanced` | Power user features |

## Edition Hierarchy

```
Enterprise (100)  ─┐
                   │ All packs & features
                   │
Team (75)        ─┤
                   │ + Security, Cost Analysis
                   │
LTD/Pro (50)     ─┤
                   │ + Logging, Alerting, GitOps, Tracing, Cloud
                   │
CE (0)           ─┘
                     Kubernetes + Prometheus only
```

### Checking Edition Access

```typescript
import { editionHasAccess, EDITION_RANK } from './lib/packs';

// Check if user can access a required edition
if (editionHasAccess(userEdition, 'team')) {
  // User has Team or higher
}

// Compare edition ranks
if (EDITION_RANK[userEdition] >= EDITION_RANK['pro']) {
  // User has Pro-level access or higher
}
```

## API Endpoints

### Get All Packs with Access Status

```bash
GET /api/v1/packs
Authorization: Bearer <token>

Response:
{
  "edition": "ltd",
  "packs": [
    {
      "id": "kubernetes",
      "name": "Kubernetes Core",
      "hasAccess": true,
      "requiredEdition": "ce"
    },
    {
      "id": "security",
      "name": "Security & Compliance",
      "hasAccess": false,
      "requiredEdition": "team"
    }
  ]
}
```

### Check Specific Pack Access

```bash
GET /api/v1/packs/security/access

Response:
{
  "packId": "security",
  "hasAccess": false,
  "userEdition": "ltd",
  "requiredEdition": "team",
  "upgradeRequired": true
}
```

### Get User Entitlements

```bash
GET /api/v1/entitlements
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "edition": "ltd"
  },
  "limits": {
    "maxClusters": 5,
    "maxWorkspaces": 5,
    "aiMode": "byok"
  },
  "packs": ["kubernetes", "prometheus", "logging", ...],
  "features": ["ai-chat", "ai-rca", "cloud-sync", ...]
}
```

## Desktop App Integration

### Using the Pack Store

```typescript
// apps/desktop/src/stores/packStore.ts
import { create } from 'zustand';

interface PackStore {
  packs: Pack[];
  loadPacks: () => Promise<void>;
  canAccess: (packId: string) => boolean;
}

export const usePackStore = create<PackStore>((set, get) => ({
  packs: [],

  loadPacks: async () => {
    const response = await api.get('/api/v1/packs');
    set({ packs: response.packs });
  },

  canAccess: (packId: string) => {
    const pack = get().packs.find(p => p.id === packId);
    return pack?.hasAccess ?? false;
  },
}));
```

### Lock UI Component

```tsx
// apps/desktop/src/components/packs/PackCard.tsx
function PackCard({ pack }: { pack: Pack }) {
  const isLocked = !pack.hasAccess;

  return (
    <Card className={isLocked ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex justify-between">
          <h3>{pack.name}</h3>
          {isLocked && (
            <Badge variant="outline">
              <Lock className="w-3 h-3 mr-1" />
              {pack.requiredEdition}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardFooter>
        {isLocked ? (
          <Button variant="outline" onClick={openUpgradeModal}>
            Upgrade to Unlock
          </Button>
        ) : (
          <Button onClick={() => installPack(pack)}>
            Install
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

## Adding Partner Packs

For third-party integrations:

1. Create pack definition with `category: 'partner'`
2. Optionally set `is_paid: true` for monetized packs
3. Include partner metadata

```typescript
{
  id: 'partner-datadog',
  name: 'Datadog Integration',
  description: 'Connect to Datadog for monitoring',
  category: 'partner',
  minEdition: 'pro',
  editions: ['pro', 'team', 'enterprise'],
  metadata: {
    author: 'Datadog',
    repository: 'https://github.com/datadog/kubeagentics-pack',
    partnerTier: 'premium',
    supportUrl: 'https://datadog.com/support',
  },
}
```

## Future Pack Ideas

Reserved pack IDs for future development:

| Pack ID | Description | Target Edition |
|---------|-------------|----------------|
| `service-mesh` | Istio/Linkerd management | Team |
| `backup-recovery` | Velero backup integration | Team |
| `chaos-engineering` | Chaos Monkey integration | Enterprise |
| `finops` | Advanced cost management | Enterprise |
| `ml-platform` | ML/AI workload management | Enterprise |

## Database Schema

See migration `014_pack_registry.sql` for the full schema.

Key tables:
- `pack_definitions` - Pack metadata and access rules
- `feature_definitions` - Feature metadata
- `user_pack_installations` - Per-user pack installations
- `user_feature_flags` - Per-user feature overrides
- `edition_configs` - Edition definitions and limits
