import { Listr, color } from "listr2";

import { copyAssets } from "@/compiler/copy/copyAssets";
import { buildWeappAllNpm } from "@/compiler/npm/buildNpm";
import { compileAllTs } from "@/compiler/typescript/compileTs";
import { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
import { compileAllWxss } from "@/compiler/wxss/compileStyle";

export enum BuildTaskTypeEnum {
  npm = "npm",
  wxss = "wxss",
  wxml = "wxml",
  copy = "copy",
  ts = "ts",
}

const listr2TimerFormat = {
  condition: true,
  field: (duration: number) => `${duration}ms`,
  format: () => color.dim,
};

export async function buildAllTasks({
  isProd,
  buildTaskType,
}: {
  isProd: boolean;
  buildTaskType?: BuildTaskTypeEnum | BuildTaskTypeEnum[];
}) {
  const taskConfigList: Array<{
    type: BuildTaskTypeEnum;
    title: string;
    task: () => Promise<void>;
  }> = [
    {
      type: BuildTaskTypeEnum.npm,
      title: "构建 NPM",
      task: async () => {
        await buildWeappAllNpm();
      },
    },
    {
      type: BuildTaskTypeEnum.wxss,
      title: "编译 WXSS",
      task: async () => {
        await compileAllWxss(isProd);
      },
    },
    {
      type: BuildTaskTypeEnum.wxml,
      title: "转译 WXML",
      task: async () => {
        await transformAllWxmlFiles();
      },
    },
    {
      type: BuildTaskTypeEnum.copy,
      title: "复制 JSON/JS",
      task: async () => {
        await copyAssets();
      },
    },
    {
      type: BuildTaskTypeEnum.ts,
      title: "编译 TS",
      task: async () => {
        await compileAllTs(isProd);
      },
    },
  ];

  const innerTasks =
    typeof buildTaskType === "string"
      ? taskConfigList.filter((item) => item.type === buildTaskType)
      : !buildTaskType || buildTaskType.length === 0
        ? Object.values(taskConfigList)
        : taskConfigList.filter((item) => buildTaskType.includes(item.type));

  const totalTaskCount = Object.keys(taskConfigList).length;
  const innerTaskCount = innerTasks.length;
  if (innerTaskCount === 0) return innerTaskCount;

  if (innerTaskCount > 1) {
    const tasks = new Listr(
      [
        {
          title: totalTaskCount === innerTaskCount ? "全量构建" : `构建 ${innerTaskCount} 个任务`,
          task: (_, task) => task.newListr(innerTasks),
        },
      ],
      { concurrent: false, rendererOptions: { collapseSubtasks: false, timer: listr2TimerFormat } },
    );

    await tasks.run();
  } else {
    const tasks = new Listr(innerTasks, {
      concurrent: false,
      rendererOptions: { collapseSubtasks: false, timer: listr2TimerFormat },
    });
    await tasks.run();
  }

  return innerTaskCount;
}
