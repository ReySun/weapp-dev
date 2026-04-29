import type { ViteDevServer } from "vite";
import { createServer } from "vite";

import { getDevServerUrl } from "@/compiler/replace";
import { WeappDevContext } from "@/config/mergedConfig";

import { getWxssViteConfig } from "./viteConfig";

let viteDevServer: ViteDevServer | null = null;
let viteDevServerPromise: Promise<ViteDevServer> | null = null;

/**
 * 创建 vite 开发服务器并启动监听
 */
export async function createViteDevServer() {
  const buildConfig = await getWxssViteConfig();
  const server = await createServer(buildConfig);
  await server.listen();

  // 打印 CDN dev 资源地址
  const { cdn } = WeappDevContext.config;
  if (cdn?.dev?.enabled) {
    const url = getDevServerUrl(server);
    if (url) {
      const base = url.replace(/\/+$/, "");
      for (const d of cdn.dirs) {
        const dir = d.replace(/^\/+/, "");
        console.info(`[weapp-dev] 静态资源地址: ${base}/${dir}`);
      }
    }
  }

  return server;
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
        WeappDevContext.viteDevServer = server;
        return server;
      })
      .catch((err) => {
        // 失败时要清掉 Promise，否则会卡死
        viteDevServerPromise = null;
        throw err;
      });
  }

  return viteDevServerPromise;
}

/**
 * 关闭 vite 开发服务器
 */
export async function closeViteDevServer() {
  if (viteDevServer) {
    await viteDevServer.close();
    viteDevServer = null;
    viteDevServerPromise = null;
    WeappDevContext.viteDevServer = undefined;
  }
}
