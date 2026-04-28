import { basename } from "node:path";

import { WeappDevContext } from "@/config/mergedConfig";
import { fsCopy } from "@/utils/fs/fs";
import { copyLogger } from "@/utils/logger";

/**
 * 复制src文件到dist目录
 * @param srcPath
 * @param showLog
 */
export async function copySrcFileToDist(srcPath: string, showLog = false) {
  const { config } = WeappDevContext;
  const { srcRoot, outDir } = config;
  const distPath = srcPath.replace(new RegExp(`/${srcRoot}/`), `/${outDir}/`);

  await fsCopy(srcPath, distPath);
  if (showLog) {
    copyLogger.success(`${basename(srcPath)} 复制完成`);
  }
}
