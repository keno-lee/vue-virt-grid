import { type PluginOption } from 'vite';
import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ElementPlus from 'unplugin-element-plus/vite';

// function themeCustomCss(): PluginOption {
//   return {
//     name: 'theme-custom-css',
//     enforce: 'pre',
//     resolveId(source, importer, options) {
//       if (source.endsWith('vp-doc.css')) {
//         return fileURLToPath(new URL('./theme/vp-doc-custom.css', import.meta.url));
//       }
//     },
//   };
// }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'vue-virt-grid',
  description: 'vue-virt-grid',

  head: [['link', { rel: 'icon', href: '/vue-virt-grid/favicon.ico' }]],

  base: '/vue-virt-grid/',

  assetsDir: '/public',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/guide/start/' },
      { text: '示例', link: '/examples/base/basic/' },
      { text: 'API', link: '/api/' },
      // { text: 'Playground', link: '/playground/' },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/keno-lee/vue-virt-grid',
      },
    ],

    sidebar: {
      '/guide/': [
        { text: '开始使用', link: '/guide/start/' },
        { text: '主题', link: '/guide/theme/' },
      ],
      '/examples/': [
        {
          text: '配置式表格',
          items: [
            {
              text: '基础功能',
              collapsed: false,
              items: [
                { text: '基础', link: '/examples/base/basic/' },
                { text: '边框', link: '/examples/base/border/' },
                { text: '斑马纹', link: '/examples/base/stripe/' },
                { text: '空态', link: '/examples/base/empty/' },
                { text: '无表头', link: '/examples/base/no-header/' },
                { text: '自动换行', link: '/examples/base/wrap/' },
                { text: '溢出隐藏', link: '/examples/base/overflow/' },
                { text: '高亮', link: '/examples/base/highlight/' },
                { text: '冻结列', link: '/examples/base/fixed/' },

                { text: '列宽拖拽', link: '/examples/column/' },

                { text: '自定义类/样式', link: '/examples/custom-class-style/' },
              ],
            },
            { text: '展开', link: '/examples/expand/' },
            { text: '树形', link: '/examples/tree/' },
            { text: '分组', link: '/examples/group/' },
            { text: '合并单元格', link: '/examples/merge/' },
            // { text: '表尾' },
            {
              text: '列渲染',
              collapsed: false,
              items: [
                { text: '表头' },
                { text: '文本' },
                { text: '索引', link: '/examples/index-view/' },
                { text: '复选框', link: '/examples/checkbox/' },
                { text: '单选' },
                { text: '多选' },
                { text: '超链接' },
                { text: '图片' },
                { text: '人员' },
                { text: '自定义渲染', link: '/examples/custom/' },
              ],
            },
            {
              text: '单元格渲染',
              collapsed: false,
              items: [{ text: '单元格', link: '/examples/cells/' }],
            },
            { text: '事件处理', link: '/examples/events/' },
            { text: 'spreadsheet(实验室)', link: '/examples/spreadsheet/' },
            { text: '高性能', link: '/examples/performance/' },
          ],
        },
      ],
    },
  },

  markdown: {
    container: {
      detailsLabel: '源码',
    },
    config(md) {
      md.core.ruler.before('block', 'vue-virt-grid-example-snippet-pre', (state) => {
        const regex = /<!<< (.+)/;
        let result = regex.exec(state.src);
        while (result) {
          const [, match] = result;
          state.src = state.src.replace(
            regex,
            `
<!!<< ${match}
::: details
  <<< ${match}
:::
        `,
          );
          result = regex.exec(state.src);
        }
      });

      md.block.ruler.before(
        'table',
        'vue-virt-grid-example-snippet',
        (state, startLine, endLine) => {
          const regex = /<!!<< (.+)/;
          let start = state.bMarks[startLine] + state.tShift[startLine];
          let max = state.eMarks[startLine];
          const result = regex.exec(state.src.slice(start, max));
          if (!result) {
            return false;
          }
          const [, sourceFile] = result;

          const ViewName = sourceFile.replace('.vue', '').replace(/\.*?\//g, '');
          let scriptToken = state.tokens.find((token) => /<script( setup)?>/.test(token.content))!;
          if (!scriptToken) {
            scriptToken = state.push('html_block', '', 0);
            scriptToken.content = '<script setup>\n</script>\n';
            scriptToken.block = true;
          }
          scriptToken.content = scriptToken.content.replace(
            /<script(.*)>\n/,
            `<script$1>\nimport ${ViewName} from  '${sourceFile}' \n`,
          );

          const token = state.push('html_inline', '', 0);
          token.content = `<ClientOnly><${ViewName}/></ClientOnly>`;
          token.block = false;
          token.map = [startLine, startLine + 1];

          state.line++;
          return true;
        },
      );
    },
  },
  vite: {
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    // configFile: path.resolve(__dirname, '../../scripts/dev.ts'),
    plugins: [ElementPlus({}), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../', import.meta.url)),
        'vue-virt-grid': fileURLToPath(new URL('../../src/', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
    },
    ssr: {
      noExternal: ['@vue/repl'],
    },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         'vue-virt-grid': ['vue-virt-grid'],
    //       },
    //       chunkFileNames(chunkInfo) {
    //         if (chunkInfo.name === 'vue-virt-grid') {
    //           return 'public/[name].js';
    //         }
    //         return 'public/[name].[hash].js'
    //       },
    //       minifyInternalExports: false,
    //     }
    // },
    // }
  },
});
