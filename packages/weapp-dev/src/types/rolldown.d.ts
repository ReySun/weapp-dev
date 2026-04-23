import type { InlineConfig } from "vite";

export type RolldownOutput = NonNullable<
  NonNullable<InlineConfig["build"]>["rolldownOptions"]
>["output"];
