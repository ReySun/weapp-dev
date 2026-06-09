import { readFileSync, writeFileSync } from "node:fs";

import { WeappDevContext } from "@/config/mergedConfig";
import { getNodeModulesCacheDir } from "@/constants/pkg";
import { ensureFile } from "@/utils/fs/ensureFile";
import { fsCopy, fsRemove, fsStat } from "@/utils/fs/fs";
import { isDirectory } from "@/utils/fs/isDirectory";
import { resolve } from "@/utils/fs/resolve";
import { weappNpmDir } from "@/weapp/platform";

const npmCacheDir = "npm";
const npmCacheFile = "npm.txt";
const cacheFile = resolve(getNodeModulesCacheDir(), npmCacheFile);

export async function getCachedKey() {
  if (!(await fsStat(cacheFile))) {
    return "";
  }

  return readFileSync(cacheFile, "utf-8");
}

export async function setCachedKey(key: string) {
  ensureFile(cacheFile);
  writeFileSync(cacheFile, key);
}

export function getWeappNpmDirs() {
  const { outDir, npm } = WeappDevContext.config;

  const npmDirs = [];
  npmDirs.push(resolve(outDir, weappNpmDir));
  if (npm.subPackages) {
    npmDirs.push(
      ...Object.keys(npm.subPackages).map((subName) => resolve(outDir, subName, weappNpmDir)),
    );
  }
  return npmDirs;
}

/**
 * 设置npm缓存
 * @param cacheKey 缓存key
 */
export async function setWeappNpmBuildFileCache(cacheKey: string) {
  const { outDir } = WeappDevContext.config;
  if (!isDirectory(resolve(outDir, weappNpmDir))) {
    return;
  }
  await fsCopy(resolve(outDir, weappNpmDir), resolve(getNodeModulesCacheDir(), npmCacheDir));

  await setCachedKey(cacheKey);
}

/**
 * 恢复npm缓存到dist/miniprogram_npm
 * @returns
 */
export async function restoreWeappNpmBuildFileCache() {
  const cacheKey = await getCachedKey();
  if (!cacheKey) {
    return;
  }

  const { outDir } = WeappDevContext.config;

  await fsCopy(resolve(getNodeModulesCacheDir(), npmCacheDir), resolve(outDir, weappNpmDir));
}

/**
 * 清除npm缓存
 */
export async function clearWeappNpmBuildFileCache() {
  await fsRemove(cacheFile);
  await fsRemove(resolve(getNodeModulesCacheDir(), npmCacheDir));
}
