import { readFileSync, existsSync } from "fs";

import type { WeappAppJson } from "@weapp-dev/miniprogram-json-schema";

import { WeappDevContext } from "@/config/mergedConfig";

export function getAppJson(): WeappAppJson | null {
  const { srcRoot } = WeappDevContext.config;
  // 定义可能的路径顺序
  const paths = [`${srcRoot}/app.json`, "./app.json"];

  let app: WeappAppJson | null = null;

  for (const filePath of paths) {
    if (existsSync(filePath)) {
      try {
        app = JSON.parse(readFileSync(filePath, "utf-8")) as WeappAppJson;
        break; // 成功读取后跳出循环
      } catch {}
    }
  }

  if (!app) {
    console.warn("未找到 app.json 文件");
    return app;
  }

  return app;
}
