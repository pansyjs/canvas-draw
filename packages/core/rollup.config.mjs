import path from 'node:path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import glob from 'fast-glob';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const entries = (await glob(
  ['**/*.{ts,tsx}'],
  {
    cwd: 'src',
  },
)).map(item => path.join('src', item));

export default defineConfig([
  {
    input: entries,
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      esbuild({
        platform: 'browser',
      }),
    ],
    external: ['react', 'react-dom'],
    output: [
      {
        format: 'es',
        entryFileNames: '[name].mjs',
        dir: 'dist/esm',
        preserveModules: true,
        sourcemap: true,
      },
      {
        format: 'cjs',
        entryFileNames: '[name].js',
        dir: 'dist/cjs',
        preserveModules: true,
        sourcemap: true,
      },
    ],
  },
  {
    input: entries,
    plugins: [
      dts(),
    ],
    output: {
      format: 'es',
      dir: 'dist/esm',
      preserveModules: true,
      entryFileNames: (chuck) => {
        return `${chuck.name.replace('src/', '')}.d.ts`;
      },
    },
  },
  {
    input: entries,
    plugins: [dts()],
    output: {
      format: 'cjs',
      dir: 'dist/cjs',
      preserveModules: true,
      entryFileNames: (chuck) => {
        return `${chuck.name.replace('src/', '')}.d.ts`;
      },
    },
  },
]);
