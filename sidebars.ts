import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'getting-started',
    {
      type: 'category',
      label: 'Plans & Billing',
      items: [
        'plans/overview',
        'plans/pricing',
        'plans/credits',
        'plans/trial',
        'plans/lifetime-deal',
      ],
    },
    {
      type: 'category',
      label: 'Monitoring',
      items: [
        'monitoring/overview',
        'monitoring/metrics-explorer',
        'monitoring/log-explorer',
        'monitoring/live-tail',
        'monitoring/alerts',
        'monitoring/alert-rules',
        'monitoring/silences',
        'monitoring/events',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/overview',
        'integrations/issue-tracking',
        'integrations/alerts',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/ai-chat',
        'features/ask-mode',
        'features/plan-mode',
        'features/rca',
        'features/runbooks',
        'features/pod-exec',
        'features/port-forward',
        'features/dashboard-shortcuts',
        'features/local-cli-tools',
        'features/token-efficiency',
        'features/cost-analysis',
      ],
    },
    {
      type: 'category',
      label: 'Guardrails',
      items: [
        'guardrails/overview',
        'guardrails/tool-classification',
        'guardrails/command-safety',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer/overview',
        'developer/license-system',
        'developer/subscription-system',
        'developer/extensibility',
      ],
    },
  ],
};

export default sidebars;
