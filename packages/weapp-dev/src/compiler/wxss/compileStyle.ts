// import { build, mergeConfig } from "vite";
import { readFileSync } from "node:fs";
import { extractClassesFromWxss } from "./extractClassesFromWxss";
import { setClassCache } from "./globalClassCache";
import { taskManager } from "@/worker/taskManager";
import { WorkerTaskEnum } from "@/worker/types";
import { wxssLogger } from "@/utils/logger";
import { WeappDevContext } from "@/utils/context/initContext";
import { getAppWxssDistPath, getAppWxssSrcPath } from "@/weapp/wxss";
import { getAllWxssSrcPaths } from "@/weapp/wxss";
import path from "node:path";
// import { getDefaultViteConfig } from "@/config/viteConfig";

/**
 * 编译 WXSS 文件
 * @param input WXSS 文件路径
 */
export async function compileWxss(input: string, showLog = true) {
  let start = null;
  if (showLog) {
    start = Date.now();
  }
  const viteDevServer = WeappDevContext.viteDevServer;

  if (!viteDevServer) {
    throw new Error("viteDevServer is not initialized");
  }

  await viteDevServer.transformRequest(input);

  if (showLog) {
    const duration = Date.now() - start;
    wxssLogger.success(`${path.basename(input)}编译完成 (${duration}ms)`);
  }
}

/**
 * 快捷编译 app.wxss，wxml文件更新时可能需要更新它。
 */
export async function compileAppWxss() {
  await compileWxss(getAppWxssSrcPath());
}

/**
 * 编译所有 WXSS 文件
 */
export async function compileAllWxss() {
  const styles = getAllWxssSrcPaths();
  // console.log(styles);

  await Promise.all(
    styles.map(async (input) => await compileWxss(input, false)),
  );

  // const buildConfig = mergeConfig(
  //   WeappDevContext.viteConfig,
  //   getDefaultViteConfig(styles),
  // );
  // await build(buildConfig);

  const appWxss = getAppWxssDistPath();
  const appWxssContent = readFileSync(appWxss, "utf-8");

  const twClasses = extractClassesFromWxss(appWxssContent);
  setClassCache(twClasses);
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
