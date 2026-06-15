import type { InlineConfig } from "tsdown";

import { vitePluginReplaceAssetPaths } from "@/compiler/replace";
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

  const viteAlias = WeappDevContext.viteConfig.resolve?.alias;
  const tsdownAlias = Array.isArray(viteAlias)
    ? viteAlias.reduce<Record<string, string>>((acc, entry) => {
        if (
          typeof entry === "object" &&
          entry !== null &&
          "find" in entry &&
          "replacement" in entry
        ) {
          if (typeof entry.find === "string") {
            acc[entry.find] = entry.replacement;
          } else {
            tsLogger.warn(
              `tsdown 不支持正则形式的 alias（find: ${entry.find}），已跳过。详情请参考: https://tsdown.dev/reference/api/Interface.InlineConfig#alias`,
            );
          }
        }
        return acc;
      }, {})
    : viteAlias;
  // console.log(tsdownAlias);
  return {
    logLevel: !isProd ? "error" : "error",
    watch: false,
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
    alias: tsdownAlias as any,
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
      if (buildStartTime) {
        if (buildStartTime && !isFirstWatchSuccess) {
          tsLogger.success(`TS编译完成 (${Date.now() - buildStartTime}ms)`);
        }
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
      vitePluginReplaceAssetPaths(isProd),
    ],
  };
}
