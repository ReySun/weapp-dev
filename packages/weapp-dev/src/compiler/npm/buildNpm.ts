export type BuildNpmResult = any;

import { statSync } from "node:fs";

import { WeappDevContext } from "@/config/mergedConfig";
import { WEABB_DEV_VERSION } from "@/constants/version";
import { fsCopy, fsRemove, fsStat } from "@/utils/fs/fs";
import { resolve } from "@/utils/fs/resolve";
import { npmLogger } from "@/utils/logger";
import { weappNpmDir } from "@/weapp/platform";

import {
  clearWeappNpmBuildFileCache,
  getCachedKey,
  getWeappNpmDirs,
  restoreWeappNpmBuildFileCache,
  setWeappNpmBuildFileCache,
} from "./npmCache";

export async function buildWeappAllNpm(params?: {
  emptyDir?: boolean;
  showLog?: boolean;
}): Promise<void> {
  const ci = (await import("miniprogram-ci")).default;
  const { emptyDir, showLog = false } = params || {};
  const { outDir, npm } = WeappDevContext.config;

  if (!npm.enable) {
    return;
  }

  const packageJsonPath = resolve("package.json");
  const pkgStat = await fsStat(packageJsonPath);
  if (!pkgStat) {
    return;
  }

  const cacheKey = `${outDir}-${pkgStat.mtime}-${WEABB_DEV_VERSION}`;

  const cachedKey = await getCachedKey();

  if (emptyDir) {
    await Promise.all(getWeappNpmDirs().map(async (dir) => await fsRemove(dir)));
  }

  // 先全部打进主包
  const buildMainPkg = async () => {
    if (showLog) {
      npmLogger.info("开始构建npm");
    }
    await ci.packNpmManually({
      packageJsonPath,
      miniprogramNpmDistDir: `./${outDir}/`,
    });
  };

  // 设置缓存，缓存模拟的是构建主包ci.packNpmManually的结果
  if (npm.cache) {
    if (cachedKey !== cacheKey) {
      await buildMainPkg();
      await clearWeappNpmBuildFileCache();
      await setWeappNpmBuildFileCache(cacheKey);
      if (showLog) {
        npmLogger.info("缓存未命中，重新构建npm");
      }
    } else {
      if (showLog) {
        npmLogger.info("缓存命中，直接跳过构建npm");
      }
      // 缓存命中，直接返回
      await restoreWeappNpmBuildFileCache();
    }
  } else {
    // 清除缓存 + 重新构建主包
    await clearWeappNpmBuildFileCache();
    await buildMainPkg();
  }

  // 再复制到子包，并且移除主包的依赖
  if (npm.subPackages) {
    for (const [subName, subConfig] of Object.entries(npm.subPackages)) {
      const { dependencies } = subConfig;
      if (!dependencies || dependencies.length === 0) continue;

      await Promise.all(
        dependencies.map(async (dep) => {
          const originDepPath = resolve(outDir, weappNpmDir, dep);
          if (statSync(originDepPath).isDirectory()) {
            await fsCopy(originDepPath, resolve(outDir, subName, weappNpmDir, dep));
            await fsRemove(originDepPath);
          }
        }),
      );
    }
  }
}
