import ora from "ora";

import type { BuildTaskTypeEnum } from "./constants";

export async function initCommand({
  isProd = true,
  buildTaskType = undefined,
  empty = false,
}: {
  isProd?: boolean;
  buildTaskType?: BuildTaskTypeEnum[] | undefined;
  empty?: boolean;
}) {
  const spinner = ora("weapp dev 初始化中...").start();
  try {
    const { initWeappDev, buildAllTasks } = await import("./tasks");

    await initWeappDev({ empty: empty });
    // spinner.succeed("项目初始化完成");
    spinner.stop();
    spinner.clear();

    await buildAllTasks({
      isProd,
      buildTaskType,
    });
  } catch {
    spinner.fail("weapp dev 初始化失败");
  }
}
