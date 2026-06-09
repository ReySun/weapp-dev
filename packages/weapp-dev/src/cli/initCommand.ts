import { createInterface } from "node:readline";

import ora from "ora";

import { checkMiniprogramRoot, projectConfigJsonExists } from "@/weapp/projectConfigJson";

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

    if (!projectConfigJsonExists()) {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const confirmContinue = await new Promise<boolean>((resolve) => {
        rl.question(
          "⚠️  警告: 未找到 command root 下的 project.config.json，weapp-dev 期望该文件在运行命令的根目录存在，是否继续？(y/N): ",
          (answer) => {
            rl.close();
            resolve(/^(y|yes)$/i.test(answer.trim()));
          },
        );
      });

      if (!confirmContinue) {
        console.log(
          "已取消：请先在微信开发者工具中创建 TS 项目，并确保 project.config.json 存在于当前命令根目录后再运行初始化。",
        );
        return;
      }
    }

    await buildAllTasks({
      isProd,
      buildTaskType,
    });
    checkMiniprogramRoot();
  } catch {
    spinner.fail("weapp dev 初始化失败");
  }
}
