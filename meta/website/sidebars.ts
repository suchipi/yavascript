import fs from 'node:fs';
import path from 'node:path';
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The docs are generated (see meta/ninja/generated-docs.ninja.ts), so the items
// are read off disk rather than listed here. index.md is left out because the
// category links to it; listing it too would repeat it in the sidebar.
const apiDocIds = fs
  .readdirSync(path.join(__dirname, 'docs'))
  .filter((file) => file.endsWith('.md') && file !== 'index.md')
  .map((file) => file.replace(/\.md$/, ''))
  .sort();

// Everything lives under a category so that the breadcrumbs on each doc page
// lead back to the index.
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'API Documentation',
      link: {type: 'doc', id: 'index'},
      collapsible: false,
      items: apiDocIds,
    },
  ],
};

export default sidebars;
