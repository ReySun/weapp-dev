import { InlineConfig } from "tsdown";

import { WeappDevContext } from "@/utils/context/initContext";
import { tsLogger } from "@/utils/logger";

import { copyDistNodeModules, deleteDistNodeModules } from "./hooks";
import {
  VitePluginAutoWeappSplitChunk,
  getBuildStartTime,
  resetBuildCollectedCache,
} from "./plugins/VitePluginAutoWeappSplitChunk";
import { vitePluginRewritePnpmImport } from "./plugins/vitePluginRewritePnpmImport";

export async function getTsdownConfig(params?: {
  isProd?: boolean;
  isIncremental?: boolean;
}): Promise<InlineConfig> {
  const { config } = WeappDevContext;
  const { isProd = false, isIncremental = false } = params || {};

  const unbundle = config.tsdown?.unbundle ?? false;

  return {
    logLevel: "warn",
    watch: !isProd,
    report: false,
    dts: false,
    clean: false,
    root: config.srcRoot,
    outDir: config.outDir,
    format: config.format,
    minify: isProd,
    unbundle,
    hash: false,
    // 增量更新ts不关心复制文件
    copy: !isIncremental ? (config.copy as any) : undefined,
    alias: WeappDevContext.viteConfig.resolve.alias as any,
    env: WeappDevContext.viteConfig.env,
    envFile: WeappDevContext.viteConfig.envFile,
    envPrefix: WeappDevContext.viteConfig.envPrefix || ["TSDOWN_", "VITE_"],
    define: WeappDevContext.viteConfig.define,
    outExtensions() {
      return {
        js: ".js",
        dts: ".d.ts",
      };
    },
    // outputOptions: isProd
    //   ? {
    //       chunkFileNames: () => {
    //         return "deps/chunk-[hash].js";
    //       },
    //       entryFileNames: (chunkInfo) => {
    //         // TODO: 优化 chunkFileNames 逻辑
    //         const reg = new RegExp(
    //           `${config.srcRoot}/(utils|hooks|constants|router|wrapper|plugins|storage|store|behaviors)/`,
    //         );
    //         if (reg.test(chunkInfo.facadeModuleId)) {
    //           return "deps/chunk-[hash].js";
    //         }
    //         return "[name].js";
    //       },
    //     }
    //   : {},
    hooks: {
      "build:done": async () => {
        try {
          if (unbundle) {
            await copyDistNodeModules();
            await deleteDistNodeModules();
          }
        } catch {}
      },
    },
    onSuccess() {
      const buildStartTime = getBuildStartTime();
      if (buildStartTime) {
        tsLogger.success(`TS编译完成 (${Date.now() - buildStartTime}ms)`);
        resetBuildCollectedCache();
      }
    },
    plugins: [
      vitePluginRewritePnpmImport({ unbundle }),
      VitePluginAutoWeappSplitChunk({ unbundle }),
    ],
  };
}
