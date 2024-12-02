import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'dumi';

const headPkgList: string[] = [];
// utils must build before core
// runtime must build before renderer-react
const pkgList = readdirSync(join(__dirname, '../packages')).filter(
  pkg => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg),
);

const tailPkgList = pkgList.map(path => `../packages/${path}/docs`);

export default defineConfig({
  base: '/react-material',
  publicPath: '/react-material/',
  resolve: {
    docDirs: ['docs'],
    atomDirs: tailPkgList.map(dir => ({ type: 'component', dir })),
  },
  themeConfig: {
    name: '物料',
    nav: {
      'zh-CN': [
        { title: '文档', link: '/docs' },
        { title: '组件', link: '/components' },
      ],
      'en-US': [
        { title: 'Docs', link: '/en-US/docs' },
        { title: 'Components', link: '/en-US/components' },
      ],
    },
  },
  mfsu: false,
});
