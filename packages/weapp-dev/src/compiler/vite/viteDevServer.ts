import type { ViteDevServer } from "vite";
import { createServer } from "vite";

import { getWxssViteConfig } from "./viteConfig";

let viteDevServer: ViteDevServer | null = null;
let viteDevServerPromise: Promise<ViteDevServer> | null = null;

/**
 * 创建 vite 开发服务器
 */
export async function createViteDevServer() {
  const buildConfig = await getWxssViteConfig();
  return await createServer(buildConfig);
}

/**
 * 确保获取 vite 开发服务器（并发安全）
 */
export async function ensureGetViteDevServer() {
  if (viteDevServer) {
    return viteDevServer;
  }

  if (!viteDevServerPromise) {
    viteDevServerPromise = createViteDevServer()
      .then((server) => {
        viteDevServer = server;
        return server;
      })
      .catch((err) => {
        // ❗失败时要清掉 Promise，否则会卡死
        viteDevServerPromise = null;
        throw err;
      });
  }

  return viteDevServerPromise;
}
