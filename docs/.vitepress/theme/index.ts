import { type Theme, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue';
import 'resize-observer-polyfill/dist/ResizeObserver.global';

export default  {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;
