import type { StorybookConfig } from '@storybook/react-vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "viteFinal": async (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': resolve(dirname, '../src'),   // 👈 same alias as in your app
    }
    config.plugins = [
      ...(config.plugins ?? []),
      tanstackRouter(),
    ]
    return config;
  }
};
export default config;