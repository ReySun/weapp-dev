import path from "node:path";

import { WeappDevContext } from "@/config/mergedConfig";

import { getAppJson } from "./appJson";

/**
 * 获取所有页面源码路径
 * @returns
 */
export function getWeappPagePath() {
  const { srcRoot } = WeappDevContext.config;
  const appJson = getAppJson();

  const subPackages = appJson.subPackages || appJson.subpackages || [];

  const mainPages = (appJson.pages || []).map((page) => path.join(srcRoot, page));

  const subPages: string[] = [];
  subPackages.forEach((sub) => {
    if (sub.pages && sub.pages.length) {
      sub.pages.map((page) => subPages.push(path.join(srcRoot, sub.root, page)));
    }
  });

  return [...mainPages, ...subPages];
}
