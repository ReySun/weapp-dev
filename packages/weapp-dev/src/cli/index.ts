import { cac } from "cac";

import { registerBuildCommand } from "./commands/build";
import { registerServeCommand } from "./commands/serve";

const cli = cac("weapp-dev");

export async function runCli(): Promise<void> {
  try {
    registerServeCommand(cli);
    registerBuildCommand(cli);

    cli.help();
    cli.parse();
  } catch (error) {
    console.error(String(error));
    process.exit(1);
  }
}

runCli();
