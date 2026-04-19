import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizePath } from "vite";
import { defineConfig } from "weapp-dev/config";

export default defineConfig({
  plugins: [],
  weapp: {
    copy: [{ from: "src/**/*.txt", to: "dist" }],
    weappTwConfig: {
      logLevel: "silent",
      rem2rpx: true,
      customAttributes: {
        "*": [/[a-z]+Class|[^-\s]+-class|className/],
      },
      cssEntries: [
        // 你 @import "weapp-tailwindcss"; 那个文件绝对路径
        path.resolve(import.meta.dirname, "./src/app.less"),
      ],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // additionalData: `@import "src/styles/mixins/index.less";`,
      },
    },
  },
  // 开发服务器配置（可选）
  server: {
    port: 3000,
    open: false, // 小程序开发不需要打开浏览器
  },

  // 解析配置
  resolve: {
    alias: [
      {
        find: "@",
        replacement: normalizePath(fileURLToPath(new URL("./srcx", import.meta.url))),
      },
    ],
  },
});
