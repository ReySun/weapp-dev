import { InlineConfig } from "tsdown";
import fs from "node:fs";
import path from "node:path";
import { deleteDir } from "@/utils/fs/deleteDir";
import type { Plugin } from "vite";
import { WeappDevContext } from "@/utils/context/initContext";

export const nodeModulesDir = `_virtual/deps`;

export async function getTsdownConfig(params?: {
  isProd?: boolean;
  isIncremental?: boolean;
}): Promise<InlineConfig> {
  const { config } = WeappDevContext;
  const { isProd = false, isIncremental = false } = params || {};

  return {
    logLevel: "warn",
    watch: false,
    report: false,
    dts: false,
    clean: false,
    root: config.srcRoot,
    outDir: config.outDir,
    format: config.format,
    minify: isProd,
    unbundle: !isProd,
    hash: isProd,
    // 增量更新ts不关心复制文件
    copy: !isIncremental ? (config.copy as any) : undefined,
    inputOptions: {
      checks: {
        pluginTimings: false,
        emptyImportMeta: true,
      },
    },
    outExtensions() {
      return {
        js: ".js",
        dts: ".d.ts",
      };
    },
    outputOptions: isProd
      ? {
          chunkFileNames: () => {
            return "deps/chunk-[hash].js";
          },
          entryFileNames: (chunkInfo) => {
            // TODO: 优化 chunkFileNames 逻辑
            const reg = new RegExp(
              `${config.srcRoot}/(utils|hooks|constants|router|wrapper|plugins|storage|store|behaviors)/`,
            );
            if (reg.test(chunkInfo.facadeModuleId)) {
              return "deps/chunk-[hash].js";
            }
            return "[name].js";
          },
        }
      : {
          esModule: false,
        },
    hooks: {
      "build:done": async () => {
        try {
          await copyDistNodeModules();
          await deleteDistNodeModules();
        } catch {
          //
        }
      },
    },
    plugins: [rewritePnpmImport()],
  };
}

/**
 * 获取所有 pnpm 包
 */
export async function getAllPkgsFromNodeModules() {
  const { config } = WeappDevContext;

  const base = path.resolve(`${config.outDir}/node_modules/.pnpm`);

  if (!fs.existsSync(base)) return [];

  const result: string[] = [];

  const pkgs = fs.readdirSync(base);

  pkgs.forEach((pkgDir) => {
    const nmPath = path.join(base, pkgDir, "node_modules");

    if (!fs.existsSync(nmPath)) return;

    fs.readdirSync(nmPath).forEach((name) => {
      if (name.startsWith("@")) {
        // scoped
        const scopeDir = path.join(nmPath, name);
        fs.readdirSync(scopeDir).forEach((sub) => {
          result.push(`${name}/${sub}`);
        });
      } else {
        result.push(name);
      }
    });
  });

  return Array.from(new Set(result));
}

/**
 * 复制 dist/node_modules 到目标目录
 */
export async function copyDistNodeModules() {
  const { config } = WeappDevContext;

  const pkgs = await getAllPkgsFromNodeModules();

  pkgs.forEach((pkgName) => {
    const realPath = fs.realpathSync(path.resolve(`node_modules`, pkgName));

    const target = path.resolve(`${config.outDir}/${nodeModulesDir}`, pkgName);

    fs.cpSync(realPath, target, {
      recursive: true,
    });
  });
}

/**
 * 删除 dist 目录下的 node_modules 目录
 */
export async function deleteDistNodeModules() {
  const { config } = WeappDevContext;
  deleteDir(path.resolve(`${config.outDir}/node_modules`));
}

function rewritePnpmImport(): Plugin {
  return {
    name: "rewrite-pnpm-import",
    enforce: "post",
    renderChunk(code, chunk) {
      // ✅ 判断是否包含 src 源码
      const hasNodeModules = Object.keys(chunk.modules).some((id) =>
        id.includes(`/node_modules/`),
      );

      // ❌ 如果这个 chunk 完全来自 node_modules，不处理
      if (hasNodeModules) {
        return null;
      }

      let newCode = code;

      // 删除空export {};
      if (chunk.isEntry) {
        newCode = code.replace(
          /\n?(\/\/#endregion\s*\n\s*)?export\s*{\s*};?/,
          "",
        );
      }

      return {
        // 👇 替换pnpm虚拟路径
        code: newCode.replace(
          /node_modules\/\.pnpm\/[^/]+\/node_modules\//g,
          `${nodeModulesDir}/`,
        ),
        map: null,
      };
    },
  };
}
