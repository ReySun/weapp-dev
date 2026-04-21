import { cac } from "cac";

import { registerBuildCommand } from "./commands/build";
import { registerServeCommand } from "./commands/serve";

const cli = cac("weapp-dev");

cli.option("--type <type>", "Choose a project type", {
  default: "node",
});

registerServeCommand(cli);
registerBuildCommand(cli);

const _parsed = cli.parse();
// console.log(JSON.stringify(_parsed, null, 2));
