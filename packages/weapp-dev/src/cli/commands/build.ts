import type { CAC } from "cac";

import { BuildTaskTypeEnum, type BuildOptions } from "../constants";
import { initCommand } from "../initCommand";

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
      await initCommand({
        isProd: true,
        buildTaskType: types,
        empty: options.empty,
      });
    });
}
