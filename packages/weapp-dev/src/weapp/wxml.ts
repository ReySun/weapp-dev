import { WeappDevContext } from "@/utils/context/initContext";
import { WeappFinalFileExts } from "./platform";

/**
 * 获取所有 WXML 文件 glob 模式
 * @returns
 */
export const getAllWxmlGlobPattern = () => {
  const wxml = getAllWxmlExts();

  return `${WeappDevContext.config.srcRoot}/**/*.{${wxml.join(",")}}`;
};

/**
 * 获取所有 WXML 文件扩展名
 * @returns
 */
export const getAllWxmlExts = () => {
  const wxml: string[] = [];

  for (const key in WeappFinalFileExts) {
    if (!Object.hasOwn(WeappFinalFileExts, key)) continue;

    const element = WeappFinalFileExts[key];
    wxml.push(element.wxml);
  }

  return wxml;
};
