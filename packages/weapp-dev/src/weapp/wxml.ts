import { WeappDevContext } from "@/config/mergedConfig";

import { WeappFinalFileExts } from "./platform";

/**
 * 获取所有 WXML 文件 glob 模式
 * @returns
 */
export async function getAllWxmlGlobPattern() {
  const { srcRoot } = WeappDevContext.config;

  const wxml = getAllWxmlExts();

  return `${srcRoot}/**/*.{${wxml.join(",")}}`;
}

/**
 * 获取所有 WXML 文件扩展名
 * @returns
 */
export function getAllWxmlExts() {
  const wxml: string[] = [];

  for (const key in WeappFinalFileExts) {
    if (!Object.hasOwn(WeappFinalFileExts, key)) continue;

    const element = WeappFinalFileExts[key];
    wxml.push(element.wxml);
  }

  return wxml;
}
