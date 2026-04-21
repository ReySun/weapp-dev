import { resolve } from "path";

import type { CAC } from "cac";

import { initWeappDevContext } from "@/utils/context/initContext";
import { deleteDir } from "@/utils/fs/deleteDir";
import { watchDev } from "@/watcher/watchDev";

import { buildAllTasks } from "./tasks";

export function registerServeCommand(cli: CAC) {
  cli
    .command("[root]", "start dev server") // 默认命令
    .alias("serve") // 与 Vite API 的命令名保持一致
    .alias("dev") // 与脚本名对齐的别名
    .option("--config <file>", "specify config file")
    .option("--base <path>", "public base path")
    .option("--mode <mode>", "set env mode")
    .option("--host [host]", "specify host")
    .option("--port <port>", "specify port")
    .option("--https", "use TLS + HTTP/2")
    .option("--open [path]", "open browser on startup")
    .option("--cors", "enable CORS")
    .option("--strictPort", "exit if specified port is already in use")
    .option("--force", "force the optimizer to ignore the cache and re-bundle")
    .action(async (_root: string, _options) => {
      try {
        const { config } = await initWeappDevContext(true);

        if (config.emptyOutDir) {
          deleteDir(resolve(process.cwd(), "dist"));
        }

        await buildAllTasks(false);
        // watchDev();
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
