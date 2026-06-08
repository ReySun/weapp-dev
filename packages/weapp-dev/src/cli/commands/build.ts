import type { CAC } from "cac";

import { BuildTaskTypeEnum, type BuildOptions } from "../constants";
import { initCommand } from "../initCommand";

export function registerBuildCommand(cli: CAC) {
  cli
    .command(
      "build [...types]",
      `build weapp project (types: ${Object.values(BuildTaskTypeEnum).join(" | ")})`,
    )
    .usage("weapp-dev build [...types]")
    .example("weapp-dev build")
    .example("weapp-dev build ts")
    .example("weapp-dev build ts wxss")
    .option("-e, --empty", "empty output directory before build")
    .action(async (types: BuildTaskTypeEnum[] | undefined, options: BuildOptions) => {
      await initCommand({
        isProd: true,
        buildTaskType: types,
        empty: options.empty,
      });
    });
}
