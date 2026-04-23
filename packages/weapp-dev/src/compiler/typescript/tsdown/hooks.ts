import fs from "node:fs";
import path from "node:path";

import { WeappDevContext } from "@/config/mergedConfig";
import { deleteDir } from "@/utils/fs/deleteDir";

import { nodeModulesDir } from "../constants";

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
      errorOnExist: false,
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
