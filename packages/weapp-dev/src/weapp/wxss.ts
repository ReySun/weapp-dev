import { getWeappFileFinalExtensions } from "./platform";
import { WeappDevContext } from "@/utils/context/initContext";
import FastGlob from "fast-glob";

export enum CssProcessorEnum {
  css = "css",
  less = "less",
  sass = "sass",
  scss = "scss",
  styl = "styl",
  stylus = "stylus",
  postcss = "postcss",
}

export type WeappCssProcessorKey = keyof typeof CssProcessorEnum;

export const WeappCssProcessorList = Object.values(CssProcessorEnum);

/**
 * 获取 WXSS 文件最终路径
 * @returns
 */
export const getAppWxssDistPath = async () => {
  const { outDir } = WeappDevContext.config;
  return `${outDir}/app.${(await getWeappFileFinalExtensions()).wxss}`;
};

/**
 * 获取 WXSS 文件源路径
 * @returns
 */
export const getAppWxssSrcPath = async () => {
  const { cssProcessor, srcRoot } = WeappDevContext.config;
  return `${srcRoot}/app.${cssProcessor}`;
};

/**
 * 获取所有 WXSS 文件源路径
 * @returns
 */
export const getAllWxssSrcPaths = async () => {
  const { srcRoot } = WeappDevContext.config;
  const styles = FastGlob.globSync([
    `${srcRoot}/**/*.{${WeappCssProcessorList.join(",")}}`,
    "!node_modules",
  ]);
  return styles;
};
