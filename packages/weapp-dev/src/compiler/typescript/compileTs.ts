import { tsLogger } from "@/utils/logger";
import { getEntryTsFiles } from "@/weapp/ts";
import { taskManager } from "@/worker/taskManager";
import { WorkerTaskEnum } from "@/worker/types";

import { getTsdownConfig } from "./tsdown/tsdownConfig";

/**
 * 编译单个TS 文件
 * @deprecated 请使用 `compileAllTs` 编译，并使用watch模式
 * @param input
 */
export async function compileTs(input: string) {
  const { build } = await import("tsdown");
  const start = Date.now();

  await build({
    entry: [input],
    ...(await getTsdownConfig({ isIncremental: true })),
  });

  const duration = Date.now() - start;
  tsLogger.success(`编译 TS 完成 (${duration}ms)`);
}

// 是否正在编译所有 TS 文件，避免重复编译
let isBuildAllTs = false;

/**
 * 编译所有 TS 文件
 */
export async function compileAllTs(isProd: boolean = false) {
  if (isBuildAllTs) {
    return;
  }

  const { build } = await import("tsdown");
  const entryTsFiles = getEntryTsFiles();

  if (!entryTsFiles || entryTsFiles.length === 0) {
    return;
  }

  try {
    isBuildAllTs = true;

    await build({
      entry: entryTsFiles,
      ...(await getTsdownConfig({
        isProd,
        // onFirstWatchSuccess: resolveReady,
      })),
    });

    isBuildAllTs = false;
  } catch {
    isBuildAllTs = false;
  }
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
