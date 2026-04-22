import type { Plugin } from "vite";

import { nodeModulesDir } from "./constants";

export function vitePluginRewritePnpmImport(): Plugin {
  return {
    name: "rewrite-pnpm-import",
    enforce: "post",
    renderChunk(code, chunk) {
      // ✅ 判断是否包含 src 源码
      const hasNodeModules = Object.keys(chunk.modules).some((id) => id.includes(`/node_modules/`));

      // ❌ 如果这个 chunk 完全来自 node_modules，不处理
      if (hasNodeModules) {
        return null;
      }

      let newCode = code;

      // 删除空export {};
      if (chunk.isEntry) {
        newCode = code.replace(/\n?(\/\/#endregion\s*\n\s*)?export\s*{\s*};?/, "");
      }

      return {
        // 👇 替换pnpm虚拟路径
        code: newCode.replace(/node_modules\/\.pnpm\/[^/]+\/node_modules\//g, `${nodeModulesDir}/`),
        map: null,
      };
    },
  };
}
