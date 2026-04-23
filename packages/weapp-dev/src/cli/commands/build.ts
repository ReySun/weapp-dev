import type { CAC } from "cac";

import { initWeappDevContext } from "@/utils/context/initContext";
import { deleteDir } from "@/utils/fs/deleteDir";
import { resolve } from "@/utils/fs/resolve";

import { buildAllTasks, BuildTaskTypeEnum } from "./tasks";

interface BuildOptions {
  empty?: boolean;
}

export function registerBuildCommand(cli: CAC) {
  cli
    .command(
      "build [...types]",
      `build weapp project (types: ${Object.values(BuildTaskTypeEnum).join(" | ")})`,
    )
    .usage("wd build [...types]")
    .example("wd build ts")
    .example("wd build ts wxss")
    .example("wd build (build all)")
    .option("-e, --empty", "empty output directory before build")
    .action(async (types: BuildTaskTypeEnum[] | undefined, options: BuildOptions) => {
      try {
        await initWeappDevContext();

        if (options.empty) {
          deleteDir(resolve(process.cwd(), "dist"));
        }

        const innerTaskCount = await buildAllTasks({ isProd: true, buildTaskType: types });
        if (!innerTaskCount) {
          console.log("暂无构建任务");
          return;
        }
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
