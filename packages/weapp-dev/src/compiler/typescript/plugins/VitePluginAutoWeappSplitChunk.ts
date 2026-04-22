import fs from "node:fs";
import path from "node:path";

import type { Plugin } from "vite";

import { WeappDevContext } from "@/utils/context/initContext";

let buildStartTime: number | null = null;
const graph = new Map<string, { importers: string[]; importedIds: string[] }>();
const moduleToPkg = new Map<string, Set<string>>();
const entryLikeSet = new Set<string>();

export function setBuildStartTime(startTime: number) {
  buildStartTime = startTime;
}
export function getBuildStartTime() {
  return buildStartTime;
}

export function resetBuildCollectedCache() {
  buildStartTime = null;
  graph.clear();
  moduleToPkg.clear();
  entryLikeSet.clear();
}

export function VitePluginAutoWeappSplitChunk({ unbundle = false } = {}): Plugin {
  return {
    name: "auto-weapp-split",

    buildStart() {
      if (!buildStartTime) {
        buildStartTime = Date.now();
      }
    },

    buildEnd() {
      if (unbundle) {
        return;
      }
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
