import FastGlob from "fast-glob";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createContext } from "weapp-tailwindcss/core";
import {
  isWxmlFileChanged,
  wxmlFileClassChangedInfo,
  setWxmlCache,
} from "./cache";
import { isIncludeAllClassList } from "@/compiler/wxss/globalClassCache";
import { dirname, basename } from "node:path";
import { compileAppWxss } from "@/compiler/wxss/compileStyle";
import { wxmlLogger } from "@/utils/logger";
import { getAllWxmlGlobPattern } from "@/weapp/wxml";
import { WeappDevContext } from "@/utils/context/initContext";

/**
 * 转换所有 WXML 文件
 * @param ctx
 */
export async function transformAllWxmlFiles() {
  const wxml = FastGlob.globSync(await getAllWxmlGlobPattern(), {
    absolute: true,
  });

  if (!wxml.length) {
    return;
  }

  await transformWxmlFile(wxml);
}

// 这个ctx只负责转换wxml的class
let wxmlCtx: ReturnType<typeof createContext> = null;

/**
 * 转换 WXML 文件
 * @param _wxmlList WXML 文件路径或路径列表
 * @returns
 */
export async function transformWxmlFile(
  _wxmlList: string | string[],
  isIncremental: boolean = false,
) {
  const singleFile = typeof _wxmlList === "string";
  const wxmlList = singleFile ? [_wxmlList] : _wxmlList;
  const { weappTwConfig, srcRoot, outDir } = WeappDevContext.config;

  if (!wxmlList || !wxmlList.length) {
    return;
  }
  if (!wxmlCtx) {
    wxmlCtx = createContext({
      ...weappTwConfig,
      // 不需要cssEntries。加上cssEntries会导致wxml转换巨慢，影响开发体验。
      // 这个ctx只负责转换wxml
      cssEntries: [],
    });
  }

  for (const wxmlFile of wxmlList) {
    try {
      const content = readFileSync(wxmlFile, "utf-8");

      // 文件未修改，直接跳过
      if (!isWxmlFileChanged(wxmlFile, content)) {
        continue;
      }

      let start = null;

      // 增量构建，检查 css class 是否变更过
      if (isIncremental) {
        start = Date.now();
        const { isChanged, classList, addedClass } = wxmlFileClassChangedInfo(
          wxmlFile,
          content,
        );

        // css class有变更过
        if (isChanged) {
          // 检查app.wxss里面有没有这些class，没有则需要启动构建app.wxss
          if (!isIncludeAllClassList([...classList])) {
            wxmlLogger.info(`增量tw class: ${addedClass}`);
            // 不需要await
            // compileAllWxssOnSubProcess(true);
            compileAppWxss();
          }
        }
        // 异步去更新app.wxss
      }

      // 转义 WXML tw class
      const transformed = await wxmlCtx.transformWxml(content);
      // 生成对应的 dist 文件路径
      const distPath = wxmlFile.replace(
        new RegExp(`/${srcRoot}/`),
        `/${outDir}/`,
      );

      // 创建目录
      const distDir = dirname(distPath);
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      // 写入文件
      writeFileSync(distPath, transformed);

      // 写入成功之后再设置缓存
      setWxmlCache(wxmlFile, content);

      if (start) {
        const duration = Date.now() - start;
        wxmlLogger.success(`${basename(wxmlFile)}编译完成 (${duration}ms)`);
      }
    } catch (error) {
      console.error(`❌ 编译失败 ${wxmlFile}:`, error);
    }
  }
}
