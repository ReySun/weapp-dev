import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, basename } from "node:path";

import type { WeappPageComponentJson } from "@weapp-dev/miniprogram-json-schema";
import FastGlob from "fast-glob";
import { createContext } from "weapp-tailwindcss/core";

import { compileAppWxss } from "@/compiler/wxss/compileWxss";
import { isIncludeAllClassList } from "@/compiler/wxss/globalClassCache";
import { WeappDevContext } from "@/config/mergedConfig";
import { ensureFile } from "@/utils/fs/ensureFile";
import { fsStat } from "@/utils/fs/fs";
import { wxmlLogger } from "@/utils/logger";
import { replaceFileExt } from "@/utils/string/replaceFileExt";
import { getWeappFileFinalExtensions } from "@/weapp/platform";
import { getAllWxmlGlobPattern } from "@/weapp/wxml";

import { copySrcFileToDist } from "../copy/copySrcFileToDist";
import { isWxmlFileChanged, wxmlFileChangedInfo, setWxmlCache } from "./cache";

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
  /**
   * json变更，则从wxml获取未注册的组件自动为其注册
   */
  isJsonChanged: boolean = false,
) {
  const wxmlExt = (await getWeappFileFinalExtensions()).wxml;
  const singleFile = typeof _wxmlList === "string";
  const wxmlList = singleFile
    ? [!isJsonChanged ? _wxmlList : replaceFileExt(_wxmlList, wxmlExt)]
    : _wxmlList;

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

      const { isClassChanged, classes, addedClass, vantComponents } = wxmlFileChangedInfo(
        wxmlFile,
        content,
      );

      // 更新json文件
      await copyOrReplaceJson({ wxmlFile, vantComponents, srcRoot, outDir });

      // json变更的时候，wxml不需要更新
      if (isJsonChanged) {
        continue;
      }

      // 增量构建，检查 css class 是否变更过
      if (isIncremental) {
        start = Date.now();

        // css class有变更过
        if (isClassChanged) {
          // 检查app.wxss里面有没有这些class，没有则需要启动构建app.wxss
          if (!isIncludeAllClassList([...classes])) {
            wxmlLogger.info(`增量tw class: ${addedClass}`);
            // 不需要await
            // compileAllWxssOnSubProcess(true);
            compileAppWxss();
          }
        }
      }

      // 转义 WXML tw class
      const transformed = await wxmlCtx.transformWxml(content);
      // 生成对应的 dist 文件路径
      const distPath = wxmlFile.replace(new RegExp(`/${srcRoot}/`), `/${outDir}/`);

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

/**
 * 更新json文件
 *
 * 1. 如果wxml有三方组件，但是json未引入，则自动引入（目前仅支持vant）
 * 2. 否则，复制该json文件
 */
async function copyOrReplaceJson({
  wxmlFile,
  vantComponents,
  srcRoot,
  outDir,
}: {
  wxmlFile: string;
  vantComponents: string[];
  srcRoot: string;
  outDir: string;
}) {
  // const wxmlExt = (await getWeappFileFinalExtensions()).wxml;
  // 更新同名 wxml 的 dist json文件
  const srcJsonPath = replaceFileExt(wxmlFile, "json");

  const jsonStats = await fsStat(srcJsonPath);

  if (jsonStats) {
    const jsonContent = readFileSync(srcJsonPath, "utf-8");
    let json: WeappPageComponentJson = {};
    try {
      json = JSON.parse(jsonContent);
    } catch (e) {
      console.log(e);
    }
    if (!json.usingComponents) {
      json.usingComponents = {};
    }

    // TODO 加入自定义components
    let hasVantNotDefined = false;
    vantComponents.forEach((component) => {
      if (!json.usingComponents[component]) {
        hasVantNotDefined = true;
        // TODO 加入其他三方组件库
        json.usingComponents[component] = `@vant/weapp/${component.replace("van-", "")}/index`;
      }
    });

    if (hasVantNotDefined) {
      ensureFile(
        srcJsonPath.replace(new RegExp(`/${srcRoot}/`), `/${outDir}/`),
        JSON.stringify(json, null, 2),
      );
    } else {
      await copySrcFileToDist(srcJsonPath);
    }
  }
}
