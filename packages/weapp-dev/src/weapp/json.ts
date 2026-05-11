import { existsSync } from "node:fs";

import { globSync } from "tinyglobby";

import { WeappDevContext } from "@/config/mergedConfig";

import { getWeappFileFinalExtensions } from "./platform";

/**
 * 获取所有组件和页面的json文件，以json为入口纬度
 */
export async function getCompOrPageJson() {
  const { srcRoot } = WeappDevContext.config;
  const allJsonFiles = globSync([`${srcRoot}/**/*.json`]);

  const wxmlExt = (await getWeappFileFinalExtensions()).wxml;

  const compAndPageJsonFiles = allJsonFiles.filter((file) => {
    // Page / Component
    const wxml = file.replace(/\.json$/, `.${wxmlExt}`);
    const ts = file.replace(/\.json$/, `.ts`);
    const js = file.replace(/\.json$/, `.js`);
    if (existsSync(wxml) && (existsSync(ts) || existsSync(js))) return true;
  });

  console.log(compAndPageJsonFiles);
}
