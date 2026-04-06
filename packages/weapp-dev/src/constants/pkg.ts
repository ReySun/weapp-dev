import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 当前包目录
export const PKG_ROOT_DIR = resolve(__dirname, "..");
// 文件缓存目录
export const PKG_CACHE_DIR = resolve(PKG_ROOT_DIR, ".cache");
