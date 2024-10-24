// docs/.vitepress/config.mts
import { defineConfig } from "file:///Users/hao.li/Works/github/vue-virt-grid/node_modules/.pnpm/vitepress@1.0.0-rc.44_@algolia+client-search@4.22.1_@types+node@18.19.21_sass@1.71.1_search-i_lb5mibmgg4ujcqh7md37662uhi/node_modules/vitepress/dist/node/index.js";
import { fileURLToPath } from "node:url";
import vueJsx from "file:///Users/hao.li/Works/github/vue-virt-grid/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@4.5.2_vue@3.4.21/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/hao.li/Works/github/vue-virt-grid/docs/.vitepress/config.mts";
function themeCustomCss() {
  return {
    name: "theme-custom-css",
    enforce: "pre",
    resolveId(source, importer, options) {
      if (source.endsWith("vp-doc.css")) {
        return fileURLToPath(new URL("./theme/vp-doc-custom.css", __vite_injected_original_import_meta_url));
      }
    }
  };
}
var config_default = defineConfig({
  title: "vue-virt-grid",
  description: "vue-virt-grid",
  head: [["link", { rel: "icon", href: "/vue-virt-grid/favicon.ico" }]],
  base: "/vue-virt-grid/",
  assetsDir: "/public",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide/start/" },
      { text: "Examples", link: "/examples/base/" },
      { text: "API", link: "/api/" }
      // { text: 'Playground', link: '/playground/' },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/keno-lee/vue-virt-grid"
      }
    ],
    sidebar: {
      "/guide/": [
        { text: "\u5F00\u59CB\u4F7F\u7528", link: "/guide/start/" },
        { text: "\u4E3B\u9898", link: "/guide/theme/" }
      ],
      "/examples/": [
        { text: "\u57FA\u7840\u529F\u80FD", link: "/examples/base/" },
        {
          text: "\u884C\u8BBE\u7F6E",
          collapsed: false,
          items: [
            { text: "\u9AD8\u4EAE highlight", link: "/examples/highlight/" },
            { text: "\u5C55\u5F00 expand", link: "/examples/expand/" },
            { text: "\u5206\u7EC4 group", link: "/examples/group/" },
            { text: "\u6811\u5F62 tree", link: "/examples/tree/" }
          ]
        },
        {
          text: "\u5217\u8BBE\u7F6E",
          collapsed: false,
          items: [
            { text: "\u5217\u56FA\u5B9A", link: "/examples/fixed/" },
            { text: "\u590D\u9009\u6846", link: "/examples/checkbox/" },
            { text: "\u5217\u5BBD\u62D6\u62FD", link: "/examples/column/" },
            { text: "\u81EA\u5B9A\u4E49\u7D22\u5F15", link: "/examples/index-view/" },
            { text: "\u81EA\u5B9A\u4E49\u5217\u6E32\u67D3", link: "/examples/custom/" }
          ]
        },
        {
          text: "Advance",
          collapsed: false,
          items: [
            { text: "\u5408\u5E76\u5355\u5143\u683C", link: "/examples/merge/" },
            { text: "\u9AD8\u6027\u80FD", link: "/examples/performance/" },
            { text: "\u81EA\u5B9A\u4E49\u7C7B/\u6837\u5F0F", link: "/examples/custom-class-style/" },
            { text: "\u4E8B\u4EF6\u5904\u7406", link: "/examples/events/" },
            { text: "template", link: "/examples/table/" },
            { text: "\u533A\u57DF\u9009\u4E2D", link: "/examples/selection/" },
            { text: "spreadsheet(\u5B9E\u9A8C\u5BA4)", link: "/examples/spreadsheet/" }
          ]
        }
        // { text: 'tfoot(实验室)', link: '/examples/tfoot/' },
      ]
    }
  },
  markdown: {
    container: {
      detailsLabel: "\u6E90\u7801"
    },
    config(md) {
      md.core.ruler.before("block", "vue-virt-grid-example-snippet-pre", (state) => {
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
        `
          );
          result = regex.exec(state.src);
        }
      });
      md.block.ruler.before(
        "table",
        "vue-virt-grid-example-snippet",
        (state, startLine, endLine) => {
          const regex = /<!!<< (.+)/;
          let start = state.bMarks[startLine] + state.tShift[startLine];
          let max = state.eMarks[startLine];
          const result = regex.exec(state.src.slice(start, max));
          if (!result) {
            return false;
          }
          const [, sourceFile] = result;
          const ViewName = sourceFile.replace(".vue", "").replace(/\.*?\//g, "");
          let scriptToken = state.tokens.find((token2) => /<script( setup)?>/.test(token2.content));
          if (!scriptToken) {
            scriptToken = state.push("html_block", "", 0);
            scriptToken.content = "<script setup>\n</script>\n";
            scriptToken.block = true;
          }
          scriptToken.content = scriptToken.content.replace(
            /<script(.*)>\n/,
            `<script$1>
import ${ViewName} from  '${sourceFile}' 
`
          );
          const token = state.push("html_inline", "", 0);
          token.content = `<ClientOnly><${ViewName}/></ClientOnly>`;
          token.block = false;
          token.map = [startLine, startLine + 1];
          state.line++;
          return true;
        }
      );
    }
  },
  vite: {
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    // configFile: path.resolve(__dirname, '../../scripts/dev.ts'),
    plugins: [vueJsx(), themeCustomCss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../../", __vite_injected_original_import_meta_url)),
        "vue-virt-grid": fileURLToPath(new URL("../../src/", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      host: "0.0.0.0"
    },
    ssr: {
      noExternal: ["@vue/repl"]
    }
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
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGFvLmxpL1dvcmtzL2dpdGh1Yi92dWUtdmlydC1ncmlkL2RvY3MvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hhby5saS9Xb3Jrcy9naXRodWIvdnVlLXZpcnQtZ3JpZC9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaGFvLmxpL1dvcmtzL2dpdGh1Yi92dWUtdmlydC1ncmlkL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgdHlwZSBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcyc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcblxuZnVuY3Rpb24gdGhlbWVDdXN0b21Dc3MoKTogUGx1Z2luT3B0aW9uIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndGhlbWUtY3VzdG9tLWNzcycsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgcmVzb2x2ZUlkKHNvdXJjZSwgaW1wb3J0ZXIsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChzb3VyY2UuZW5kc1dpdGgoJ3ZwLWRvYy5jc3MnKSkge1xuICAgICAgICByZXR1cm4gZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3RoZW1lL3ZwLWRvYy1jdXN0b20uY3NzJywgaW1wb3J0Lm1ldGEudXJsKSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGl0bGU6ICd2dWUtdmlydC1ncmlkJyxcbiAgZGVzY3JpcHRpb246ICd2dWUtdmlydC1ncmlkJyxcblxuICBoZWFkOiBbWydsaW5rJywgeyByZWw6ICdpY29uJywgaHJlZjogJy92dWUtdmlydC1ncmlkL2Zhdmljb24uaWNvJyB9XV0sXG5cbiAgYmFzZTogJy92dWUtdmlydC1ncmlkLycsXG5cbiAgYXNzZXRzRGlyOiAnL3B1YmxpYycsXG5cbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6ICdHdWlkZScsIGxpbms6ICcvZ3VpZGUvc3RhcnQvJyB9LFxuICAgICAgeyB0ZXh0OiAnRXhhbXBsZXMnLCBsaW5rOiAnL2V4YW1wbGVzL2Jhc2UvJyB9LFxuICAgICAgeyB0ZXh0OiAnQVBJJywgbGluazogJy9hcGkvJyB9LFxuICAgICAgLy8geyB0ZXh0OiAnUGxheWdyb3VuZCcsIGxpbms6ICcvcGxheWdyb3VuZC8nIH0sXG4gICAgXSxcblxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7XG4gICAgICAgIGljb246ICdnaXRodWInLFxuICAgICAgICBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2tlbm8tbGVlL3Z1ZS12aXJ0LWdyaWQnLFxuICAgICAgfSxcbiAgICBdLFxuXG4gICAgc2lkZWJhcjoge1xuICAgICAgJy9ndWlkZS8nOiBbXG4gICAgICAgIHsgdGV4dDogJ1x1NUYwMFx1NTlDQlx1NEY3Rlx1NzUyOCcsIGxpbms6ICcvZ3VpZGUvc3RhcnQvJyB9LFxuICAgICAgICB7IHRleHQ6ICdcdTRFM0JcdTk4OTgnLCBsaW5rOiAnL2d1aWRlL3RoZW1lLycgfSxcbiAgICAgIF0sXG4gICAgICAnL2V4YW1wbGVzLyc6IFtcbiAgICAgICAgeyB0ZXh0OiAnXHU1N0ZBXHU3ODQwXHU1MjlGXHU4MEZEJywgbGluazogJy9leGFtcGxlcy9iYXNlLycgfSxcblxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1x1ODg0Q1x1OEJCRVx1N0Y2RScsXG4gICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgeyB0ZXh0OiAnXHU5QUQ4XHU0RUFFIGhpZ2hsaWdodCcsIGxpbms6ICcvZXhhbXBsZXMvaGlnaGxpZ2h0LycgfSxcblxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QzU1XHU1RjAwIGV4cGFuZCcsIGxpbms6ICcvZXhhbXBsZXMvZXhwYW5kLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIwNlx1N0VDNCBncm91cCcsIGxpbms6ICcvZXhhbXBsZXMvZ3JvdXAvJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODExXHU1RjYyIHRyZWUnLCBsaW5rOiAnL2V4YW1wbGVzL3RyZWUvJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG5cbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6ICdcdTUyMTdcdThCQkVcdTdGNkUnLFxuICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIxN1x1NTZGQVx1NUI5QScsIGxpbms6ICcvZXhhbXBsZXMvZml4ZWQvJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1OTBEXHU5MDA5XHU2ODQ2JywgbGluazogJy9leGFtcGxlcy9jaGVja2JveC8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTUyMTdcdTVCQkRcdTYyRDZcdTYyRkQnLCBsaW5rOiAnL2V4YW1wbGVzL2NvbHVtbi8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTgxRUFcdTVCOUFcdTRFNDlcdTdEMjJcdTVGMTUnLCBsaW5rOiAnL2V4YW1wbGVzL2luZGV4LXZpZXcvJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU4MUVBXHU1QjlBXHU0RTQ5XHU1MjE3XHU2RTMyXHU2N0QzJywgbGluazogJy9leGFtcGxlcy9jdXN0b20vJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiAnQWR2YW5jZScsXG4gICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1NDA4XHU1RTc2XHU1MzU1XHU1MTQzXHU2ODNDJywgbGluazogJy9leGFtcGxlcy9tZXJnZS8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTlBRDhcdTYwMjdcdTgwRkQnLCBsaW5rOiAnL2V4YW1wbGVzL3BlcmZvcm1hbmNlLycgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1ODFFQVx1NUI5QVx1NEU0OVx1N0M3Qi9cdTY4MzdcdTVGMEYnLCBsaW5rOiAnL2V4YW1wbGVzL2N1c3RvbS1jbGFzcy1zdHlsZS8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTRFOEJcdTRFRjZcdTU5MDRcdTc0MDYnLCBsaW5rOiAnL2V4YW1wbGVzL2V2ZW50cy8nIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICd0ZW1wbGF0ZScsIGxpbms6ICcvZXhhbXBsZXMvdGFibGUvJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MzNBXHU1N0RGXHU5MDA5XHU0RTJEJywgbGluazogJy9leGFtcGxlcy9zZWxlY3Rpb24vJyB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnc3ByZWFkc2hlZXQoXHU1QjlFXHU5QThDXHU1QkE0KScsIGxpbms6ICcvZXhhbXBsZXMvc3ByZWFkc2hlZXQvJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHsgdGV4dDogJ3Rmb290KFx1NUI5RVx1OUE4Q1x1NUJBNCknLCBsaW5rOiAnL2V4YW1wbGVzL3Rmb290LycgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcblxuICBtYXJrZG93bjoge1xuICAgIGNvbnRhaW5lcjoge1xuICAgICAgZGV0YWlsc0xhYmVsOiAnXHU2RTkwXHU3ODAxJyxcbiAgICB9LFxuICAgIGNvbmZpZyhtZCkge1xuICAgICAgbWQuY29yZS5ydWxlci5iZWZvcmUoJ2Jsb2NrJywgJ3Z1ZS12aXJ0LWdyaWQtZXhhbXBsZS1zbmlwcGV0LXByZScsIChzdGF0ZSkgPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IC88ITw8ICguKykvO1xuICAgICAgICBsZXQgcmVzdWx0ID0gcmVnZXguZXhlYyhzdGF0ZS5zcmMpO1xuICAgICAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICAgICAgY29uc3QgWywgbWF0Y2hdID0gcmVzdWx0O1xuICAgICAgICAgIHN0YXRlLnNyYyA9IHN0YXRlLnNyYy5yZXBsYWNlKFxuICAgICAgICAgICAgcmVnZXgsXG4gICAgICAgICAgICBgXG48ISE8PCAke21hdGNofVxuOjo6IGRldGFpbHNcbiAgPDw8ICR7bWF0Y2h9XG46OjpcbiAgICAgICAgYCxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJlc3VsdCA9IHJlZ2V4LmV4ZWMoc3RhdGUuc3JjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1kLmJsb2NrLnJ1bGVyLmJlZm9yZShcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgJ3Z1ZS12aXJ0LWdyaWQtZXhhbXBsZS1zbmlwcGV0JyxcbiAgICAgICAgKHN0YXRlLCBzdGFydExpbmUsIGVuZExpbmUpID0+IHtcbiAgICAgICAgICBjb25zdCByZWdleCA9IC88ISE8PCAoLispLztcbiAgICAgICAgICBsZXQgc3RhcnQgPSBzdGF0ZS5iTWFya3Nbc3RhcnRMaW5lXSArIHN0YXRlLnRTaGlmdFtzdGFydExpbmVdO1xuICAgICAgICAgIGxldCBtYXggPSBzdGF0ZS5lTWFya3Nbc3RhcnRMaW5lXTtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWdleC5leGVjKHN0YXRlLnNyYy5zbGljZShzdGFydCwgbWF4KSk7XG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgWywgc291cmNlRmlsZV0gPSByZXN1bHQ7XG5cbiAgICAgICAgICBjb25zdCBWaWV3TmFtZSA9IHNvdXJjZUZpbGUucmVwbGFjZSgnLnZ1ZScsICcnKS5yZXBsYWNlKC9cXC4qP1xcLy9nLCAnJyk7XG4gICAgICAgICAgbGV0IHNjcmlwdFRva2VuID0gc3RhdGUudG9rZW5zLmZpbmQoKHRva2VuKSA9PiAvPHNjcmlwdCggc2V0dXApPz4vLnRlc3QodG9rZW4uY29udGVudCkpITtcbiAgICAgICAgICBpZiAoIXNjcmlwdFRva2VuKSB7XG4gICAgICAgICAgICBzY3JpcHRUb2tlbiA9IHN0YXRlLnB1c2goJ2h0bWxfYmxvY2snLCAnJywgMCk7XG4gICAgICAgICAgICBzY3JpcHRUb2tlbi5jb250ZW50ID0gJzxzY3JpcHQgc2V0dXA+XFxuPC9zY3JpcHQ+XFxuJztcbiAgICAgICAgICAgIHNjcmlwdFRva2VuLmJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2NyaXB0VG9rZW4uY29udGVudCA9IHNjcmlwdFRva2VuLmNvbnRlbnQucmVwbGFjZShcbiAgICAgICAgICAgIC88c2NyaXB0KC4qKT5cXG4vLFxuICAgICAgICAgICAgYDxzY3JpcHQkMT5cXG5pbXBvcnQgJHtWaWV3TmFtZX0gZnJvbSAgJyR7c291cmNlRmlsZX0nIFxcbmAsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnN0IHRva2VuID0gc3RhdGUucHVzaCgnaHRtbF9pbmxpbmUnLCAnJywgMCk7XG4gICAgICAgICAgdG9rZW4uY29udGVudCA9IGA8Q2xpZW50T25seT48JHtWaWV3TmFtZX0vPjwvQ2xpZW50T25seT5gO1xuICAgICAgICAgIHRva2VuLmJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgdG9rZW4ubWFwID0gW3N0YXJ0TGluZSwgc3RhcnRMaW5lICsgMV07XG5cbiAgICAgICAgICBzdGF0ZS5saW5lKys7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gIH0sXG4gIHZpdGU6IHtcbiAgICBlc2J1aWxkOiB7XG4gICAgICBqc3hGYWN0b3J5OiAnaCcsXG4gICAgICBqc3hGcmFnbWVudDogJ0ZyYWdtZW50JyxcbiAgICB9LFxuICAgIC8vIGNvbmZpZ0ZpbGU6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9zY3JpcHRzL2Rldi50cycpLFxuICAgIHBsdWdpbnM6IFt2dWVKc3goKSwgdGhlbWVDdXN0b21Dc3MoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4uLy4uLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAndnVlLXZpcnQtZ3JpZCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4vLi4vc3JjLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIH0sXG4gICAgc3NyOiB7XG4gICAgICBub0V4dGVybmFsOiBbJ0B2dWUvcmVwbCddLFxuICAgIH0sXG4gICAgLy8gYnVpbGQ6IHtcbiAgICAvLyAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAvLyAgICAgb3V0cHV0OiB7XG4gICAgLy8gICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgLy8gICAgICAgICAndnVlLXZpcnQtZ3JpZCc6IFsndnVlLXZpcnQtZ3JpZCddLFxuICAgIC8vICAgICAgIH0sXG4gICAgLy8gICAgICAgY2h1bmtGaWxlTmFtZXMoY2h1bmtJbmZvKSB7XG4gICAgLy8gICAgICAgICBpZiAoY2h1bmtJbmZvLm5hbWUgPT09ICd2dWUtdmlydC1ncmlkJykge1xuICAgIC8vICAgICAgICAgICByZXR1cm4gJ3B1YmxpYy9bbmFtZV0uanMnO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgcmV0dXJuICdwdWJsaWMvW25hbWVdLltoYXNoXS5qcydcbiAgICAvLyAgICAgICB9LFxuICAgIC8vICAgICAgIG1pbmlmeUludGVybmFsRXhwb3J0czogZmFsc2UsXG4gICAgLy8gICAgIH1cbiAgICAvLyB9LFxuICAgIC8vIH1cbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sWUFBWTtBQUhpTSxJQUFNLDJDQUEyQztBQUtyUSxTQUFTLGlCQUErQjtBQUN0QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxVQUFVLFFBQVEsVUFBVSxTQUFTO0FBQ25DLFVBQUksT0FBTyxTQUFTLFlBQVksR0FBRztBQUNqQyxlQUFPLGNBQWMsSUFBSSxJQUFJLDZCQUE2Qix3Q0FBZSxDQUFDO0FBQUEsTUFDNUU7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxpQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsYUFBYTtBQUFBLEVBRWIsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssUUFBUSxNQUFNLDZCQUE2QixDQUFDLENBQUM7QUFBQSxFQUVwRSxNQUFNO0FBQUEsRUFFTixXQUFXO0FBQUEsRUFFWCxhQUFhO0FBQUE7QUFBQSxJQUVYLEtBQUs7QUFBQSxNQUNILEVBQUUsTUFBTSxTQUFTLE1BQU0sZ0JBQWdCO0FBQUEsTUFDdkMsRUFBRSxNQUFNLFlBQVksTUFBTSxrQkFBa0I7QUFBQSxNQUM1QyxFQUFFLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFBQTtBQUFBLElBRS9CO0FBQUEsSUFFQSxhQUFhO0FBQUEsTUFDWDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsSUFFQSxTQUFT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
