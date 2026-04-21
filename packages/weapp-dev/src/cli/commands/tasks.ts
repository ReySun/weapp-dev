import { Listr } from "listr2";

import { copyAssets } from "@/compiler/copy/copyAssets";
import { buildWeappAllNpm } from "@/compiler/npm/buildNpm";
import { compileAllTs } from "@/compiler/typescript/compileTs";
import { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
import { compileAllWxss } from "@/compiler/wxss/compileStyle";
import { runTimeEnd } from "@/utils/runTimeEnd";

export async function buildAllTasks(isProd: boolean) {
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
                task.title = `构建 npm ${await runTimeEnd(() => buildWeappAllNpm())}ms`;
              },
            },

            {
              title: "编译 WXSS",
              task: async (_, task) => {
                task.title = `编译 WXSS ${await runTimeEnd(() => compileAllWxss(isProd))}ms`;
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
                task.title = `编译 TS ${await runTimeEnd(() => compileAllTs(isProd))}ms`;
              },
            },
          ]),
      },
    ],
    { concurrent: false, rendererOptions: { collapseSubtasks: false } },
  );

  await tasks.run();
}
