import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {prismThemeDark, prismThemeLight} from './src/prism-theme';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'YavaScript',
  tagline:
    'A cross-platform bash-like script runner and repl, distributed as a single statically-linked program',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'suchipi', // Usually your GitHub org/user name.
  projectName: 'yavascript', // Usually your repo name.

  onBrokenLinks: 'throw',

  // The generated API docs are plain markdown, not MDX; parsing them as MDX
  // would choke on things like `<T>` appearing in prose.
  markdown: {
    format: 'detect',
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Same as the default, minus the leading-underscore markdown rule:
          // __filename-and-__dirname.md is a real doc page, not a partial.
          exclude: [
            '**/_*.{js,jsx,ts,tsx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          editUrl:
            'https://github.com/suchipi/yavascript/tree/main/meta/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'YavaScript logo',
        src: 'img/logo.png',
        className: 'navbarLogo',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'API Documentation',
        },
        {
          href: 'https://github.com/suchipi/yavascript',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'API Documentation',
              to: '/docs/',
            },
          ],
        },
        {
          title: 'Download',
          items: [
            {
              label: 'Releases',
              href: 'https://github.com/suchipi/yavascript/releases',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/suchipi/yavascript',
            },
            {
              label: 'QuickJS (the engine we use)',
              href: 'https://github.com/suchipi/quickjs/',
            },
          ],
        },
      ],
      copyright: 'YavaScript is written with &lt;3 by Lily Skye.',
    },
    prism: {
      theme: prismThemeLight,
      darkTheme: prismThemeDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
