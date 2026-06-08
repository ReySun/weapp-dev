import type { CAC } from "cac";

import type { BuildOptions } from "../constants";
import { initCommand } from "../initCommand";

export function registerServeCommand(cli: CAC) {
  cli
    .command("serve [root]", "start dev server")
    .alias("dev")
    .option("-e, --empty", "empty output directory before build")
    .action(async (_root: string, options: BuildOptions) => {
      await initCommand({
        isProd: false,
        empty: options.empty,
      });
    });
}
