import { cac } from "cac";

import { WEABB_DEV_VERSION } from "@/constants/version";

import { registerBuildCommand } from "./commands/build";
import { registerServeCommand } from "./commands/serve";

const cli = cac("weapp-dev");

export async function runCli(): Promise<void> {
  try {
    registerServeCommand(cli);
    registerBuildCommand(cli);

    cli.version(WEABB_DEV_VERSION);
    cli.help();

    const parsed = cli.parse();

    // 如果没有匹配到任何命令，且没有请求 version，显示 help
    if (!cli.matchedCommand && !parsed.options.version) {
      cli.outputHelp();
    }
  } catch (error: any) {
    console.error(error.stack);
    process.exit(1);
  }
}

runCli();
