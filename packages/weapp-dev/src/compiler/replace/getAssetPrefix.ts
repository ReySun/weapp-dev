import type { ViteDevServer } from "vite";

import { WeappDevContext } from "@/config/mergedConfig";

/**
 * 从 Vite 开发服务器获取可用的访问 URL
 * 优先返回局域网地址（方便手机预览），fallback 到本地地址
 */
export function getDevServerUrl(server: ViteDevServer): string | undefined {
  return server.resolvedUrls?.network?.[0] ?? server.resolvedUrls?.local?.[0];
}

/**
 * 根据当前环境获取资源前缀
 * - prod: 返回用户配置的 cdn.url
 * - dev: 若 cdn.dev.enabled 为 true，优先使用 cdn.dev.prefix，
 *        否则尝试从 viteDevServer 获取局域网地址（方便手机预览），
 *        若 viteDevServer 尚未启动，则从 viteConfig.server.port 回退构建 URL
 */
export function getAssetPrefix(isProd: boolean): string | undefined {
  const { cdn } = WeappDevContext.config;
  if (!cdn) return;

  if (isProd) {
    return cdn.url;
  }

  if (!cdn.dev?.enabled) return;

  if (cdn.dev.prefix) {
    return cdn.dev.prefix;
  }

  const server = WeappDevContext.viteDevServer;
  if (server) {
    const url = getDevServerUrl(server);
    if (url) {
      return url;
    }
  }

  // 回退：从 viteConfig 读取端口构建 URL
  const port = WeappDevContext.viteConfig.server?.port ?? 5173;
  return `http://localhost:${port}`;
}
