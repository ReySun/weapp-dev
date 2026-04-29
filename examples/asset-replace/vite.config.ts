import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizePath } from "vite";
import { defineConfig } from "weapp-dev/config";

export default defineConfig({
  plugins: [],
  weapp: {
    // copy: [{ from: "src/**/*.{png,jpg,jpeg,json}", to: "dist" }],
    npm: {
      enable: false,
    },
    /**
     * 静态资源 CDN 配置
     *
     * 将小程序包内静态资源外置到 CDN，减少主包体积。
     *
     * 注意：启用后，weapp.copy 中应尽量避免手动配置复制该目录下的文件，
     * 框架会自动处理资源复制逻辑（仅在未启用 CDN 替换时复制到 dist）。
     *
     * 若启用了 dev.enabled，开发时使用 Vite 本地服务提供资源。
     * 手机真机预览时，需开启电脑代理并让手机连接代理才能访问 localhost；
     * 否则应禁用 dev.enabled 并配置 url，让开发环境也走线上 CDN。
     */
    cdn: {
      dirs: ["assets"],
      url: "https://cdn.example.com",
      dev: {
        enabled: true,
      },
    },
    weappTwConfig: {
      logLevel: "silent",
      rem2rpx: true,
      customAttributes: {
        "*": [/[a-z]+Class|[^-\s]+-class|className/],
      },
      cssEntries: [
        path.resolve(import.meta.dirname, "./src/app.less"),
      ],
    },
  },
  css: {
    preprocessorOptions: {
      less: {},
    },
  },
  server: {
    port: 3001,
    open: false,
  },
  resolve: {
    alias: {
      "@": normalizePath(fileURLToPath(new URL("./src", import.meta.url))),
    },
  },
});
