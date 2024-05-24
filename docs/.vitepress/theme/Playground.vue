<template>
  <Repl
    :editor="Monaco"
    style="height: 100vh"
    :store="store"
    :theme="data.isDark.value ? 'dark' : 'light'"
    :previewOptions="{ headHTML: styleCode }"
  />
</template>
<script lang="ts" setup>
import { useData } from 'vitepress';
import { ReplStore, Repl } from '@vue/repl';
import 'vue-virt-grid/styles/index.scss';
const Monaco = (await import('@vue/repl/monaco-editor')).default;

const styleCode = `
<link rel="stylesheet" type="text/css" href="xxx">
`;

const store = new ReplStore({});
const data = useData();
store.setImportMap({
  imports: {
    vue: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.3.13/dist/runtime-dom.esm-browser.js',
    'vue/server-renderer':
      'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.3.13/dist/server-renderer.esm-browser.js',
    'vue-demi': 'https://cdn.jsdelivr.net/npm/vue-demi@0.14.6/lib/index.mjs',
    'vue-virt-grid': 'xxx',
  },
});
</script>
