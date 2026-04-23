import { build } from "tsdown";

import { tsLogger } from "@/utils/logger";

import { getTsdownConfig } from "./tsdownConfig";
import { getEntryTsFiles } from "./utils";

/**
 * 编译单个TS 文件
 * @deprecated 请使用 `compileAllTs` 编译，并使用watch模式
 * @param input
 */
export async function compileTs(input: string) {
  const start = Date.now();

  await build({
    entry: [input],
    ...(await getTsdownConfig({ isIncremental: true })),
  });

  const duration = Date.now() - start;
  tsLogger.success(`编译 TS 完成 (${duration}ms)`);
}

/**
 * 编译所有 TS 文件
 */
export async function compileAllTs(isProd: boolean = false) {
  const entryTsFiles = getEntryTsFiles();

  let resolveReady!: () => void;

  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  await build({
    entry: entryTsFiles,
    ...(await getTsdownConfig({ isProd, onFirstWatchSuccess: resolveReady })),
  });

  return await ready;
}
