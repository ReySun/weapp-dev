import { build } from "tsdown";

import { WeappDevContext } from "@/utils/context/initContext";
import { tsLogger } from "@/utils/logger";

import { getTsdownConfig } from "./tsdownConfig";

export async function compileTs(input: string) {
  const start = Date.now();

  await build({
    entry: [input],
    ...(await getTsdownConfig({ isIncremental: true })),
  });

  const duration = Date.now() - start;
  tsLogger.success(`编译 TS 完成 (${duration}ms)`);
}

export async function compileAllTs(isProd: boolean = false) {
  const { srcRoot } = WeappDevContext.config;
  await build({
    entry: [`${srcRoot}/**/*.ts`, `!${srcRoot}/**/*.d.ts`],
    ...(await getTsdownConfig({ isProd })),
  });
}
