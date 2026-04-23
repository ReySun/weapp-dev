import { cac } from "cac";

import { registerBuildCommand } from "./commands/build";
import { registerServeCommand } from "./commands/serve";

const cli = cac("weapp-dev");

registerServeCommand(cli);
registerBuildCommand(cli);

cli.help();
cli.parse();
