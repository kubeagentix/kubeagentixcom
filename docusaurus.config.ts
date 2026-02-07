import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'KubeAgentics',
  tagline: 'AI-Powered Kubernetes Desktop Companion',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://kubeagentics.dev',
  baseUrl: '/',

  organizationName: 'kubeagentics',
  projectName: 'kubeagentics-ce',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/kubeagentics/kubeagentics-ce/tree/main/apps/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/kubeagentics/kubeagentics-ce/tree/main/apps/docs/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/kubeagentics-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'KubeAgentics',
      logo: {
        alt: 'KubeAgentics Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/kubeagentics/kubeagentics-ce',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Integrations',
              to: '/docs/integrations/overview',
            },
            {
              label: 'MSP/SI Partners',
              to: '/docs/partners/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/kubeagentics/kubeagentics-ce/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/kubeagentics/kubeagentics-ce',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} KubeAgentics. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
