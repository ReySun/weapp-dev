import type { InlineConfig } from "tsdown";

import { WeappDevContext } from "@/config/mergedConfig";
import { tsLogger } from "@/utils/logger";

import { copyDistNodeModules, deleteDistNodeModules } from "./hooks";
import {
  vitePluginAutoWeappSplitChunk,
  getBuildStartTime,
  resetBuildCollectedCache,
} from "./vitePluginAutoWeappSplitChunk";
import { vitePluginDeleteEmptyExport } from "./vitePluginDeleteEmptyExport";
import { vitePluginRewritePnpmImport } from "./vitePluginRewritePnpmImport";

let isFirstWatchSuccess = true;
export async function getTsdownConfig(params?: {
  isProd?: boolean;
  isIncremental?: boolean;
  onFirstWatchSuccess?: (...args: any[]) => any;
}): Promise<InlineConfig> {
  const { config } = WeappDevContext;
  const { isProd = false, isIncremental = false, onFirstWatchSuccess } = params || {};

  const unbundle = config.tsdown?.unbundle ?? false;

  return {
    logLevel: !isProd ? "silent" : "warn",
    watch: !isProd,
    report: isProd,
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
      if (buildStartTime && !isFirstWatchSuccess) {
        tsLogger.success(`TS编译完成 (${Date.now() - buildStartTime}ms)`);
        resetBuildCollectedCache();
      }

      if (isFirstWatchSuccess) {
        isFirstWatchSuccess = false;
        onFirstWatchSuccess?.();
      }
    },
    plugins: [
      vitePluginDeleteEmptyExport(),
      vitePluginRewritePnpmImport({ unbundle }),
      vitePluginAutoWeappSplitChunk({ unbundle }),
    ],
  };
}
