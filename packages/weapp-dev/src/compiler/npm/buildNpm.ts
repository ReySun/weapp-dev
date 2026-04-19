import { resolve } from "node:path";

import ci from "miniprogram-ci";

export type BuildNpmResult = Awaited<ReturnType<typeof ci.packNpmManually>>;

import { WeappDevContext } from "@/utils/context/initContext";
import { fsStat } from "@/utils/fs/fs";

export async function buildMainNpm(): Promise<BuildNpmResult | undefined> {
  const packageJsonPath = resolve(process.cwd(), "package.json");
  if (!(await fsStat(packageJsonPath))) {
    return undefined;
  }
  return await ci.packNpmManually({
    packageJsonPath,
    miniprogramNpmDistDir: `./${WeappDevContext.config.outDir}/`,
  });
}
