import { readFileSync } from "node:fs";
import path from "node:path";

import { wxssLogger } from "@/utils/logger";
import { getAppWxssDistPath, getAppWxssSrcPath } from "@/weapp/wxss";
import { getAllWxssSrcPaths } from "@/weapp/wxss";
import { taskManager } from "@/worker/taskManager";
import { WorkerTaskEnum } from "@/worker/types";

import { viteWxssBuild } from "../vite/viteBuild";
import { ensureGetViteDevServer } from "../vite/viteDevServer";
import { extractClassesFromWxss } from "./extractClassesFromWxss";
import { setClassCache } from "./globalClassCache";

/**
 * 编译 WXSS 文件
 * @param input WXSS 文件路径
 */
export async function compileWxss(input: string, showLog = true) {
  const viteDevServer = await ensureGetViteDevServer();
  let start = null;
  if (showLog) {
    start = Date.now();
  }

  if (!viteDevServer) {
    throw new Error("viteDevServer is not initialized");
  }
  await viteDevServer.transformRequest(input);

  if (showLog && start) {
    const duration = Date.now() - start;
    wxssLogger.success(`${path.basename(input)}编译完成 (${duration}ms)`);
  }
}

/**
 * 快捷编译 app.wxss，wxml文件更新时可能需要更新它。
 */
export async function compileAppWxss() {
  const appSrcWxssPath = await getAppWxssSrcPath();
  if (!appSrcWxssPath) {
    return;
  }
  await compileWxss(appSrcWxssPath);
}

/**
 * 编译所有 WXSS 文件
 */
export async function compileAllWxss(isProd: boolean = false) {
  const styles = await getAllWxssSrcPaths();

  if (!isProd) {
    // const limit = pLimit(2000); // 👈 推荐 4~8
    await Promise.all(styles.map(async (input) => await compileWxss(input, false)));
  } else {
    await viteWxssBuild();
  }

  try {
    const appWxss = await getAppWxssDistPath();
    const appWxssContent = readFileSync(appWxss, "utf-8");

    const twClasses = extractClassesFromWxss(appWxssContent);
    setClassCache(twClasses);
  } catch {
    //
  }
}

export async function compileAllWxssOnSubProcess(showLog = false) {
  const start = Date.now();

  try {
    await taskManager.runTask({
      id: "compileAllxss",
      type: WorkerTaskEnum.buildAllWxss,
    });

    if (showLog) {
      const duration = Date.now() - start;
      wxssLogger.success(`编译 WXSS 完成 (${duration}ms)`);
    }
  } catch (error) {
    if (showLog) {
      const duration = Date.now() - start;
      if (error === "exit") {
        wxssLogger.info(`取消编译 WXSS (${duration}ms)`);
        return;
      }
      wxssLogger.error(`编译 WXSS 失败 (${duration}ms)`);
    }
  }
}
