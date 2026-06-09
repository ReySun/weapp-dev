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
 * 检查 project.config.json 中的 miniprogramRoot/srcMiniprogramRoot 配置是否与 weapp-dev 的 outDir 配置匹配，如果不匹配则输出警告提示
 * @returns
 */
export function checkMiniprogramRoot() {
  if (!projectConfigJsonExists()) {
    return;
  }

  const projectConfigPath = resolve("project.config.json");
  const projectConfig: WeappProjectConfigJson = JSON.parse(
    readFileSync(resolve(projectConfigPath), "utf-8"),
  );

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
