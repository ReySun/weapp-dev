import { resolve } from "path";

import type { CAC } from "cac";

import { initWeappDevContext } from "@/config/mergedConfig";
import { deleteDir } from "@/utils/fs/deleteDir";
import { watchDev } from "@/watcher/watchDev";

import { buildAllTasks } from "../tasks";

export function registerServeCommand(cli: CAC) {
  cli
    .command("[root]", "start dev server") // 默认命令
    .alias("serve") // 与 Vite API 的命令名保持一致
    .alias("dev") // 与脚本名对齐的别名
    .action(async (_root: string, _options) => {
      try {
        const { config } = await initWeappDevContext();

        if (config.emptyOutDir) {
          deleteDir(resolve(process.cwd(), "dist"));
        }

        await buildAllTasks({ isProd: false });
        watchDev();
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
