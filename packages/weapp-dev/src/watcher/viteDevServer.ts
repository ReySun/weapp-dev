import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import FastGlob from "fast-glob";
import { createServer, mergeConfig, Plugin } from "vite";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";

import { getDefaultViteConfig } from "@/config/viteConfig";
import { WeappDevContext } from "@/utils/context/initContext";
import { replaceFileExt } from "@/utils/string/replaceFileExt";
import { replaceSrcToDist } from "@/utils/string/replaceSrcToDist";
import { getWeappFileFinalExtensions } from "@/weapp/platform";
import { getAllWxssSrcPaths, WeappCssProcessorList } from "@/weapp/wxss";

export async function getWxssViteConfig(isProd = false) {
  const { config, viteConfig } = WeappDevContext;
  const { weappTwConfig } = config;

  const buildConfig = mergeConfig(viteConfig, {
    ...getDefaultViteConfig(
      FastGlob.globSync([
        // src下的wxss相关文件
        ...(await getAllWxssSrcPaths()),
        "!node_modules",
      ]),
    ),
    plugins: [
      UnifiedViteWeappTailwindcssPlugin({ ...weappTwConfig, logLevel: "silent" }),
      ...(isProd ? [] : [writeFileToDisk()]),
    ],
  });

  return buildConfig;
}

export async function createViteDevServer() {
  const buildConfig = await getWxssViteConfig();
  return await createServer(buildConfig);
}

function writeFileToDisk(): Plugin {
  const { config, weappTwCtx } = WeappDevContext;
  const { srcRoot, outDir } = config;

  return {
    name: "write-to-dist",

    async transform(code: string, id: string) {
      if (id.includes("node_modules")) return;

      let dist = "";
      const wxssExt = WeappCssProcessorList.find((item) => id.endsWith(item));

      if (wxssExt) {
        // 转换src目录到dist目录
        dist = replaceSrcToDist(replaceFileExt(id, (await getWeappFileFinalExtensions()).wxss), {
          fromDir: srcRoot,
          toDir: outDir,
        });

        // 需要转换tw class
        if (id.endsWith(`app.${wxssExt}`)) {
          code = (await weappTwCtx.transformWxss(code)).css;
        }
      }

      if (dist) {
        mkdirSync(dirname(dist), { recursive: true });
        writeFileSync(dist, code);
      }
      return code;
    },
  };
}
