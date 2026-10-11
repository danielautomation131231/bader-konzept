import { defineConfig } from 'vite';

export default defineConfig({
  // Für GitHub Pages unter /bader-konzept/ – per Env überschreibbar
  base: process.env.PAGES_BASE ?? '/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 8192,
  },
});
