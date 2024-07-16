import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const coreDir = join(__dirname, '../core/src');

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@pansy/canvas-draw',
        replacement: coreDir,
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [],
});
