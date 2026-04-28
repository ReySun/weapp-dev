import { build } from "tsdown";

import { tsLogger } from "@/utils/logger";
import { getEntryTsFiles } from "@/weapp/ts";
import { taskManager } from "@/worker/taskManager";
import { WorkerTaskEnum } from "@/worker/types";

import { getTsdownConfig } from "./tsdown/tsdownConfig";
import { resetBuildCollectedCache } from "./tsdown/vitePluginAutoWeappSplitChunk";

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

let stop: () => Promise<void> | null = null;

/**
 * 编译所有 TS 文件
 */
export async function compileAllTs(isProd: boolean = false) {
  if (stop) {
    await stop();
  }

  const entryTsFiles = getEntryTsFiles();

  let resolveReady!: () => void;

  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });

  const bundles = await build({
    entry: entryTsFiles,
    ...(await getTsdownConfig({ isProd, onFirstWatchSuccess: resolveReady })),
  });

  if (!isProd && bundles.length > 0) {
    stop = async () => {
      // @ts-expect-error
      const asyncDispose: typeof Symbol.asyncDispose =
        Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose");
      resetBuildCollectedCache();

      await Promise.all(bundles.map(async (i) => await i?.[asyncDispose]?.()));
    };
  }

  return await ready;
}

/**
 * 子进程中编译所有 TS 文件
 * @deprecated 暂未启用，消耗大
 * @param showLog 是否显示编译日志
 * @param showLog 是否显示编译日志
 * @returns
 */
export async function compileAllTsOnSubProcess(showLog = false) {
  const start = Date.now();

  try {
    await taskManager.runTask({
      id: "compileAllTs",
      type: WorkerTaskEnum.buildAllTs,
    });

    if (showLog) {
      const duration = Date.now() - start;
      tsLogger.success(`编译 TS 完成 (${duration}ms)`);
    }
  } catch (error) {
    if (showLog) {
      const duration = Date.now() - start;
      if (error === "exit") {
        tsLogger.info(`取消编译 TS (${duration}ms)`);
        return;
      }
      tsLogger.error(`编译 TS 失败 (${duration}ms)`);
    }
  }
}
