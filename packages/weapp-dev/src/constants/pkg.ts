import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 当前包目录
export const PKG_ROOT_DIR = resolve(__dirname, "..");
// 文件缓存目录
export const PKG_CACHE_DIR = resolve(PKG_ROOT_DIR, ".cache");

export const getNodeModulesCacheDir = () => {
  const weappDevDir = ".weapp-dev";
  if (!existsSync(resolve(process.cwd(), "node_modules"))) {
    return resolve(process.cwd(), weappDevDir);
  }
  return resolve(process.cwd(), "node_modules", ".cache", weappDevDir);
};
