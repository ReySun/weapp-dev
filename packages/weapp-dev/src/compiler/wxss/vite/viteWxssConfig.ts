import FastGlob from "fast-glob";
import { InlineConfig, mergeConfig } from "vite";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";

import { WeappDevContext } from "@/config/mergedConfig";
import { RolldownOutput } from "@/config/rolldown";
import { getAllWxssSrcPaths } from "@/weapp/wxss";

import { vitePluginWxssDevWriteFile } from "./vitePluginWxssDevWriteFile";

/**
 * 获取 wxss Vite 配置
 */
export async function getWxssViteConfig(isProd = false) {
  const { config, viteConfig } = WeappDevContext;
  const { weappTwConfig } = config;

  const buildConfig = mergeConfig(viteConfig, {
    ...getDefaultViteConfig(
      FastGlob.globSync([
        // src下的wxss相关文件
        ...(await getAllWxssSrcPaths()),
      ]),
      isProd,
    ),
    plugins: [
      UnifiedViteWeappTailwindcssPlugin({ ...weappTwConfig, logLevel: "silent" }),
      ...(isProd ? [] : [vitePluginWxssDevWriteFile()]),
    ],
  });

  return buildConfig;
}

export function getDefaultViteConfig(input: string[], isProd = false): InlineConfig {
  return {
    logLevel: "silent",

    build: {
      emptyOutDir: false,
      minify: isProd,
      rolldownOptions: {
        input,
        output: getWxssPreserveModulesOutput(),
      },
    },
    plugins: [],
  };
}

export function getWxssPreserveModulesOutput(isProd: boolean = false): RolldownOutput {
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
