import { existsSync } from "node:fs";
import path from "node:path";

import FastGlob from "fast-glob";

import { WeappDevContext } from "@/config/mergedConfig";
import { getAppJson } from "@/weapp/appJson";

export function getEntryTsFiles() {
  const { srcRoot } = WeappDevContext.config;
  const appJson = getAppJson();

  const subPackages = appJson.subPackages || appJson.subpackages || [];

  const isSubPackageEntry = (file: string) => {
    return subPackages
      .filter((sub) => sub.root && sub.entry)
      .map((sub) => `${srcRoot}/${sub.root}/${sub.entry.replace(/\.js$/, ".ts")}`)
      .includes(file);
  };

  // console.time("glob tsAllFiles");
  const tsAllFiles = FastGlob.globSync([`${srcRoot}/**/*.ts`, `!${srcRoot}/**/*.d.ts`]);
  // console.timeEnd("glob tsAllFiles");

  const entryTsFIles = tsAllFiles.filter((file) => {
    // Page / Component
    const wxml = file.replace(/\.ts$/, ".wxml");
    if (existsSync(wxml)) return true;

    // 分包entry
    if (isSubPackageEntry(file)) return true;

    // src下的直接子文件，当entry处理。这样不单独判断是src/app.ts
    const rel = path.relative(srcRoot, file);
    return !rel.includes(path.sep);
  });

  return entryTsFIles;
}
