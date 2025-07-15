import * as path from 'node:path';
import { pluginPreview } from '@rspress/plugin-preview';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/canvas-draw/',
  root: path.join(__dirname, 'docs'),
  title: 'Canvas Draw',
  icon: '/logo.png',
  logo: '/logo.png',
  logoText: 'Canvas Draw',
  markdown: {
    checkDeadLinks: true,
  },
  route: {
    cleanUrls: true,
  },
  plugins: [
    pluginPreview({}),
  ],
  themeConfig: {
    enableContentAnimation: true,
    enableAppearanceAnimation: false,
    lastUpdated: true,
    hideNavbar: 'auto',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/pansyjs/canvas-draw',
      },
    ],
  },
  builderConfig: {
    resolve: {
      alias: {},
    },
  },
});
