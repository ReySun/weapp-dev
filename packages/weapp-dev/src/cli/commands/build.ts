import type { CAC } from "cac";

import { buildWeappAllNpm } from "@/compiler/npm/buildNpm";
import { compileAllTs } from "@/compiler/typescript/compileTs";
import { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
import { compileAllWxss } from "@/compiler/wxss/compileStyle";
import { initWeappDevContext } from "@/utils/context/initContext";
import { runTimeEnd } from "@/utils/runTimeEnd";

import { buildAllTasks } from "./tasks";

interface BuildOptions {
  empty?: boolean;
}

export function registerBuildCommand(cli: CAC) {
  cli
    .command("build [type]", "build project")
    .option("-e, --empty", "empty output directory before build")
    .action(async (type: string | undefined, options: BuildOptions) => {
      try {
        await initWeappDevContext();

        switch (type) {
          case "npm":
            console.log(
              `构建 npm ${await runTimeEnd(() => buildWeappAllNpm({ emptyDir: options.empty, showLog: true }))}ms`,
            );
            break;
          case "ts":
            compileAllTs();
            break;
          case undefined:
            await buildAllTasks(true);
            // TODO
            break;
          default:
            console.error(`Unknown build type: ${type}`);
            process.exit(1);
        }
      } catch (error) {
        console.error("Error starting dev server:");
        console.error(error);
      }
    });
}
