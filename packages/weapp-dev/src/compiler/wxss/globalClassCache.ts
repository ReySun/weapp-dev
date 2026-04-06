import { PKG_CACHE_DIR } from "@/constants/pkg";
import { deleteDir } from "@/utils/fs/deleteDir";
import { ensureFile } from "@/utils/fs/ensureFile";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const GLOBAL_CLASSES_CACHE_FILE = resolve(PKG_CACHE_DIR, "global-classes.json");

export const classCacheSet = new Set<string>();

export const isIncludeAllClassList = (classList: string[]) => {
  if (classCacheSet.size === 0) {
    restoreJsCacheFromFileCache(GLOBAL_CLASSES_CACHE_FILE);
  }
  return classList.every((item) => classCacheSet.has(item));
};

export function setClassCache(className: string | string[] | Set<string>) {
  if (Array.isArray(className) || className instanceof Set) {
    for (const item of className) {
      if (item && item.trim()) {
        classCacheSet.add(item);
      }
    }
  } else {
    classCacheSet.add(className);
  }

  ensureCacheFile(GLOBAL_CLASSES_CACHE_FILE);

  // TODO 优化设置这里的缓存时机
  writeFileSync(GLOBAL_CLASSES_CACHE_FILE, JSON.stringify(Array.from(classCacheSet)));
}

/**
 * 删除class缓存文件
 */
export function deleteClassFileCache() {
  classCacheSet.clear();
  deleteDir(GLOBAL_CLASSES_CACHE_FILE);
}

function ensureCacheFile(filePath: string) {
  ensureFile(filePath, "[]");
}

function restoreJsCacheFromFileCache(filePath: string) {
  ensureCacheFile(filePath);
  const classs: string[] = JSON.parse(readFileSync(filePath, "utf-8"));
  classs.forEach((item) => classCacheSet.add(item));
}
