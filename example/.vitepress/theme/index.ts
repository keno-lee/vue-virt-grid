import { type Theme, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue';


export default  {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;
