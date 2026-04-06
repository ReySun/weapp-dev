import type { CAC } from "cac";
import { Listr } from "listr2";

import { resolve } from "path";
import { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
import { compileAllWxss } from "@/compiler/wxss/compileStyle";
import { runTimeEnd } from "@/utils/runTimeEnd";
import { deleteDir } from "@/utils/fs/deleteDir";
import { watchDev } from "@/watcher/watchDev";
import { compileAllTs } from "@/compiler/typescript/compileTs";
import {
  initWeappDevContext,
  WeappDevContext,
} from "@/utils/context/initContext";

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
        // 初始化 WeappDev 上下文
        await initWeappDevContext();

        if (WeappDevContext.config.emptyOutDir) {
          deleteDir(resolve(process.cwd(), "dist"));
        }

        const tasks = new Listr([
          {
            title: "初始化构建", // 👈 公共 title
            task: (_, task) =>
              task.newListr(
                [
                  {
                    title: "编译 WXSS",
                    task: async (_, task) => {
                      task.title = `编译 WXSS ${await runTimeEnd(() => compileAllWxss())}ms`;
                    },
                  },
                  {
                    title: "编译 WXML",
                    task: async (_, task) => {
                      task.title = `编译 WXML ${await runTimeEnd(() => transformAllWxmlFiles())}ms`;
                    },
                  },
                  {
                    title: "编译 TS",
                    task: async (_, task) => {
                      task.title = `编译 TS ${await runTimeEnd(() => compileAllTs())}ms`;
                    },
                  },
                ],
                {
                  concurrent: true,
                  rendererOptions: { collapseSubtasks: false },
                },
              ),
          },
        ]);

        await tasks.run();
        watchDev();
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
