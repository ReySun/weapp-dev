import { resolve } from "path";

import type { CAC } from "cac";
import { Listr } from "listr2";

import { copy, resolveCopyEntries } from "@/compiler/copy/copy";
import { copyAssets } from "@/compiler/copy/copyAssets";
import { buildMainNpm } from "@/compiler/npm/buildNpm";
import { compileAllTs } from "@/compiler/typescript/compileTs";
import { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
import { compileAllWxss } from "@/compiler/wxss/compileStyle";
import { initWeappDevContext } from "@/utils/context/initContext";
import { deleteDir } from "@/utils/fs/deleteDir";
import { runTimeEnd } from "@/utils/runTimeEnd";
import { watchDev } from "@/watcher/watchDev";

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
        const { config } = await initWeappDevContext();

        if (config.emptyOutDir) {
          deleteDir(resolve(process.cwd(), "dist"));
        }

        // copy({
        //   copy: [
        //     {
        //       from: "/Users/reysun/Code/ai-code/weapp-dev-monorepo/examples/basic-ts-tw/src/components/bbb.json",
        //       to: "dist",
        //       flatten: false,
        //     },
        //   ],
        // });

        const tasks = new Listr(
          [
            {
              title: "初始化构建",
              task: (_, task) =>
                task.newListr([
                  // ✅ 1. 先构建 npm（串行）
                  {
                    title: "构建 npm",
                    task: async (_, task) => {
                      task.title = `构建 npm ${await runTimeEnd(() => buildMainNpm())}ms`;
                    },
                  },

                  // ✅ 2. 并发执行 wxss + wxml
                  // {
                  //   title: "编译资源",
                  //   task: (_, task) =>
                  //     task.newListr(
                  //       [
                  //         {
                  //           title: "编译 WXSS",
                  //           task: async (_, task) => {
                  //             task.title = `编译 WXSS ${await runTimeEnd(() => compileAllWxss())}ms`;
                  //           },
                  //         },
                  //         {
                  //           title: "编译 WXML",
                  //           task: async (_, task) => {
                  //             task.title = `编译 WXML ${await runTimeEnd(() => transformAllWxmlFiles())}ms`;
                  //           },
                  //         },
                  //       ],
                  //       {
                  //         concurrent: true, // 👈 这里只并发
                  //         rendererOptions: { collapseSubtasks: false },
                  //       },
                  //     ),
                  // },

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
                    title: "复制 JSON",
                    task: async (_, task) => {
                      task.title = `复制 JSON ${await runTimeEnd(() => copyAssets())}ms`;
                    },
                  },

                  // ✅ 3. 最后执行 TS
                  {
                    title: "编译 TS",
                    task: async (_, task) => {
                      task.title = `编译 TS ${await runTimeEnd(() => compileAllTs())}ms`;
                    },
                  },
                ]),
            },
          ],
          { rendererOptions: { collapseSubtasks: false } },
        );

        await tasks.run();
        watchDev();
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
