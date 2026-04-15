import type { InlineConfig } from "vite";

export type RolldownOutput = NonNullable<
  NonNullable<InlineConfig["build"]>["rolldownOptions"]
>["output"];

export function getPreserveModulesOutput(isProd: boolean = false): RolldownOutput {
  return {
    ...(isProd
      ? {
          sourcemap: false,
          minify: true,
        }
      : {
          sourcemap: false,
          minify: false,
        }),

    preserveModules: true,
    preserveModulesRoot: "src",
    // entryFileNames: "[name].js",
    // entryFileNames(chunk) {
    //   if (chunk.facadeModuleId?.endsWith(".ts")) {
    //     return "[name].js";
    //   }

    //   // if (chunk.facadeModuleId?.endsWith(".wxml")) {
    //   //   return "[name].wxml.js"; // 👈 避免冲突
    //   // }

    //   return "[name].js";
    // },
    chunkFileNames: "[name].js",
    assetFileNames: (assetInfo) => {
      const name = assetInfo.name || "";

      // 处理 css
      if (name.endsWith(".css")) {
        // 保留原路径 + 改后缀
        return name.replace(/\.css$/, ".wxss");
      }

      return name;
    },
  };
}
