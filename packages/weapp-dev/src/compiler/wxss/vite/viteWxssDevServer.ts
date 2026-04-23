import { createServer, ViteDevServer } from "vite";

import { getWxssViteConfig } from "./viteWxssConfig";

let viteDevServer: ViteDevServer | null = null;
let viteDevServerPromise: Promise<ViteDevServer> | null = null;

/**
 * 创建 wxss 开发服务器
 */
export async function createViteWxssDevServer() {
  const buildConfig = await getWxssViteConfig();
  return await createServer(buildConfig);
}

/**
 * 确保获取 wxss 开发服务器（并发安全）
 */
export async function ensureGetViteDevWxssServer() {
  if (viteDevServer) {
    return viteDevServer;
  }

  if (!viteDevServerPromise) {
    viteDevServerPromise = createViteWxssDevServer()
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
