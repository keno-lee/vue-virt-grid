import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
// import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue(), vueJsx()],
  build: {
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    target: ['chrome62'],

    rollupOptions: {
      external: ['vue', 'vue-demi'],
      preserveEntrySignatures: 'strict',

      input: './src/index.ts',
      output: {
        manualChunks: undefined,
        format: 'esm',
        dir: './lib',
        // preserveModules: true,
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]',
        // intro: 'import "./index.css";'
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../', import.meta.url)),
    },
  },
}));
