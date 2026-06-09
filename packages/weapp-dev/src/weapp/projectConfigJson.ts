import { existsSync, readFileSync } from "node:fs";

import type { WeappProjectConfigJson } from "@weapp-dev/miniprogram-json-schema";

import { WeappDevContext } from "@/config/mergedConfig";
import { resolve } from "@/utils/fs/resolve";

/**
 * project.config.json 是否存在
 * @returns
 */
export function projectConfigJsonExists(): boolean {
  const projectConfigPath = resolve("project.config.json");
  return existsSync(projectConfigPath);
}

/**
 * 或缺 project.config.json 的内容，如果文件不存在则返回 null
 * @returns
 */
export function getProjectConfigJson(): WeappProjectConfigJson | null {
  const projectConfigPath = resolve("project.config.json");
  if (!existsSync(projectConfigPath)) {
    return null;
  }

  const content = readFileSync(projectConfigPath, "utf-8");
  try {
    return JSON.parse(content) as WeappProjectConfigJson;
  } catch {
    throw new Error("解析 project.config.json 失败，请确保该文件是有效的 JSON 格式。");
  }
}

/**
 * 从 project.config.json 中获取 miniprogramRoot 或 srcMiniprogramRoot 的值
 * @returns
 */
export function getProjectConfigJsonRoot() {
  const projectConfig = getProjectConfigJson();

  if (!projectConfig) {
    return;
  }

  // 替换掉路径末尾的斜杠，确保返回的路径不以斜杠结尾
  return (
    projectConfig.miniprogramRoot ||
    projectConfig.srcMiniprogramRoot ||
    "miniprogram"
  ).replace(/\/?$/, "");
}

/**
 * 检查 project.config.json 中的 miniprogramRoot/srcMiniprogramRoot 配置是否与 weapp-dev 的 outDir 配置匹配，如果不匹配则输出警告提示
 * @returns
 */
export function checkMiniprogramRoot() {
  const projectConfig = getProjectConfigJson();

  if (!projectConfig) {
    return;
  }

  const outDir = WeappDevContext.config.outDir;
  const rootKeys = ["miniprogramRoot", "srcMiniprogramRoot"] as const;

  const mismatchedKeys = rootKeys.filter((rootKey) => {
    const originalPath = projectConfig[rootKey];
    return originalPath && !checkMiniprogramRootPath(outDir, originalPath);
  });

  if (mismatchedKeys.length > 0) {
    const keysText =
      mismatchedKeys.length === 1
        ? `配置的 ${mismatchedKeys[0]}`
        : `配置的 ${mismatchedKeys.join(" 和 ")}`;

    console.warn(
      `检测到 project.config.json 中 ${keysText} 与 weapp-dev 配置的 outDir "${outDir}" 不匹配，可能会导致构建产物无法被微信开发工具正确识别。建议将它们都配置为 "${outDir}/"`,
    );
  }
}

function checkMiniprogramRootPath(dist: string, originalPath: string) {
  return originalPath.startsWith(dist);
}
