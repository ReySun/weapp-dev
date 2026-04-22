import fs from "node:fs";
import path from "node:path";

import { InlineConfig } from "tsdown";
import type { Plugin } from "vite";

import { WeappDevContext } from "@/utils/context/initContext";
import { tsLogger } from "@/utils/logger";

import { copyDistNodeModules, deleteDistNodeModules } from "./hooks";
import { vitePluginRewritePnpmImport } from "./plugins";

let buildStartTime: number | null = null;
const graph = new Map<string, { importers: string[]; importedIds: string[] }>();
const moduleToPkg = new Map<string, Set<string>>();
const entryLikeSet = new Set<string>();

function resetBuildCache() {
  buildStartTime = null;
  graph.clear();
  moduleToPkg.clear();
  entryLikeSet.clear();
}

export async function getTsdownConfig(params?: {
  isProd?: boolean;
  isIncremental?: boolean;
}): Promise<InlineConfig> {
  const { config } = WeappDevContext;
  const { isProd = false, isIncremental = false } = params || {};

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
    unbundle: false,
    hash: isProd,
    // 增量更新ts不关心复制文件
    copy: !isIncremental ? (config.copy as any) : undefined,
    inputOptions: {
      checks: {
        pluginTimings: false,
        emptyImportMeta: true,
      },
    },
    tsconfig: false,
    alias: WeappDevContext.viteConfig.resolve.alias as any,
    env: WeappDevContext.viteConfig.env,
    envFile: WeappDevContext.viteConfig.envFile,
    envPrefix: WeappDevContext.viteConfig.envPrefix || ["TSDOWN_", "VITE_"],
    define: WeappDevContext.viteConfig.define,
    fixedExtension: false,
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
      // "build:prepare": async () => {
      //   console.log("build:prepare");
      // },
      // "build:before": async () => {
      //   console.log("build:build");
      // },
      // "build:done": async (ctx) => {
      //   try {
      //     console.log("build:done");
      //     if (ctx.options.unbundle) {
      //       await copyDistNodeModules();
      //       await deleteDistNodeModules();
      //     }
      //   } catch {
      //     //
      //   }
      // },
    },
    onSuccess() {
      if (buildStartTime) {
        tsLogger.info(`build time: ${Date.now() - buildStartTime}ms`);
        resetBuildCache();
      }
    },
    plugins: [AutoWeappSplitPlugin()],
  };
}

function AutoWeappSplitPlugin({ srcRoot = "src" } = {}): Plugin {
  return {
    name: "auto-weapp-split",

    moduleParsed() {
      // console.log(info);
      // graph.set(info.id, {
      //   importedIds: info.importedIds,
      //   importers: info.importers,
      // });
    },

    buildStart() {
      if (!buildStartTime) {
        resetBuildCache();
        buildStartTime = Date.now();
      }
      console.log("buildStart");
    },

    buildEnd() {
      console.time("buildEnd");
      for (const id of this.getModuleIds()) {
        const info = this.getModuleInfo(id);

        graph.set(id, {
          importedIds: info.importedIds,
          importers: info.importers,
        });
      }

      // 1️⃣ 找 entry-like
      for (const [id, info] of graph) {
        if (isEntryLike(id, info)) {
          entryLikeSet.add(id);
        }
      }

      // 2️⃣ 依赖扩散
      for (const id of entryLikeSet) {
        const pkg = getPackageName(id);
        collect(id, pkg);
      }
      console.timeEnd("buildEnd");
    },

    outputOptions(options) {
      options.entryFileNames = "[name].js";
      options.chunkFileNames = "[name].js";
      options.codeSplitting = {
        groups: [
          {
            name: (moduleId, ctx) => {
              // console.log(moduleId);
              const cleanId = moduleId.split("?")[0];

              if (entryLikeSet.has(cleanId)) return null;

              const info = ctx.getModuleInfo(moduleId);

              // 🚨 关键1：只被一个模块引用 → 内联
              if (!info || info.importers.length <= 1) {
                // console.log("只被一个模块引用 → 内联");
                return null; // 不分组 → 内联
              }

              const pkgs = moduleToPkg.get(cleanId);

              // 🚨 关键2：没有归属 → 主包 common
              if (!pkgs || pkgs.size === 0) {
                // console.log("没有归属 → 主包 common");
                return "common";
              }

              // 🚨 关键3：只属于一个包
              if (pkgs.size === 1) {
                const name = [...pkgs][0];
                // console.log(`只属于一个包 name: ${name}`);

                if (name === "main") return "common";

                return `${name}/common`;
              }
              // console.log("########################################################");

              // 🚨 关键4：跨包 → 主包 common
              return "common";
            },
          },
        ],
      };

      return options;
    },
  };
}

export function isEntryLike(id, info) {
  if (!id.endsWith(".ts")) return false;

  // Page / Component
  const wxml = id.replace(/\.ts$/, ".wxml");
  if (fs.existsSync(wxml)) return true;

  // 孤立入口
  if (info.importers.length === 0) return true;

  return false;
}

function getPackageName(id) {
  const rel = path.relative(WeappDevContext.config.srcRoot, id);
  const [top] = rel.split(path.sep);

  // if (top === "pages") return "main";
  return top;
}

function collect(id, pkg, visited = new Set()) {
  if (visited.has(id)) return;
  visited.add(id);

  if (!moduleToPkg.has(id)) {
    moduleToPkg.set(id, new Set());
  }

  moduleToPkg.get(id).add(pkg);

  const deps = graph.get(id)?.importedIds || [];
  deps.forEach((dep) => collect(dep, pkg, visited));
}
