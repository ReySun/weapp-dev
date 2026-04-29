import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";

import type { Plugin } from "vite";

import { WeappDevContext } from "@/config/mergedConfig";
import { WeappCssProcessorList } from "@/weapp/wxss";

import { getAssetPrefix } from "./getAssetPrefix";
import { replaceAssetPaths } from "./replaceAssetPaths";

const mimeTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
};

function getMimeType(path: string): string {
  const ext = path.slice(path.lastIndexOf("."));
  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Vite 插件：替换 WXSS/JS 中的资源路径，dev 模式下 serve 本地资源
 */
export function vitePluginReplaceAssetPaths(isProd: boolean): Plugin {
  const { cdn, srcRoot, cwd } = WeappDevContext.config;

  if (!cdn) {
    return { name: "weapp-dev:replace-asset-pass" };
  }

  const dirs = cdn.dirs;
  const prefix = getAssetPrefix(isProd);

  return {
    name: "weapp-dev:replace-asset-paths",

    transform(code, id) {
      if (!prefix) return null;
      if (id.includes("node_modules")) return null;

      const isStyle = WeappCssProcessorList.some((ext) => id.endsWith(ext));
      if (isStyle) {
        const newCode = replaceAssetPaths({ content: code, fileType: "wxss", dirs, prefix });
        return newCode === code ? null : { code: newCode, map: null };
      }

      return null;
    },

    renderChunk(code, _chunk) {
      if (!prefix) return null;

      const newCode = replaceAssetPaths({ content: code, fileType: "js", dirs, prefix });
      return newCode === code ? null : { code: newCode, map: null };
    },

    generateBundle(_options, bundle) {
      if (!prefix) return;

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "asset") {
          const fileName = chunk.fileName || "";
          if (fileName.endsWith(".wxss")) {
            const source = chunk.source.toString();
            const newSource = replaceAssetPaths({ content: source, fileType: "wxss", dirs, prefix });
            if (newSource !== source) {
              chunk.source = newSource;
            }
          }
        }
      }
    },

    configureServer(server) {
      if (isProd || !cdn.dev?.enabled) return;

      for (const dir of dirs) {
        const localPath = dir.slice(1);
        const srcAssetsDir = resolve(cwd || process.cwd(), srcRoot, localPath);
        const publicAssetsDir = resolve(cwd || process.cwd(), localPath);

        server.middlewares.use(dir, (req, res, next) => {
          const relPath = (req.url || "").slice(1);

          const srcFile = join(srcAssetsDir, relPath);
          try {
            const data = readFileSync(srcFile);
            res.setHeader("Content-Type", getMimeType(srcFile));
            res.end(data);
            return;
          } catch {
            // src 下不存在，尝试 public 下
          }

          const publicFile = join(publicAssetsDir, relPath);
          try {
            const data = readFileSync(publicFile);
            res.setHeader("Content-Type", getMimeType(publicFile));
            res.end(data);
            return;
          } catch {
            // public 下也不存在
          }

          next();
        });
      }
    },
  };
}
