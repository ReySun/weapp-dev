import type { Plugin } from "vite";

export function vitePluginDeleteEmptyExport(): Plugin {
  return {
    name: "delete-empty-export",
    enforce: "post",
    renderChunk(code, chunk) {
      // ✅ 判断是否包含 src 源码
      const hasNodeModules = Object.keys(chunk.modules).some((id) => id.includes(`/node_modules/`));

      // ❌ 如果这个 chunk 完全来自 node_modules，不处理
      if (hasNodeModules || !chunk.isEntry) {
        return null;
      }

      return {
        // 删除空export {};
        code: code.replace(/\n?(\/\/#endregion\s*\n\s*)?export\s*{\s*};?/, ""),
        map: null,
      };
    },
  };
}
