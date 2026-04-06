import { createServer, loadConfigFromFile, mergeConfig, Plugin } from "vite";
import FastGlob from "fast-glob";
import { getDefaultViteConfig } from "@/config/viteConfig";
import { replaceFileExt } from "@/utils/string/replaceFileExt";
import { getAllWxssSrcPaths, WeappCssProcessorList } from "@/weapp/wxss";
import { replaceSrcToDist } from "@/utils/string/replaceSrcToDist";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createContext } from "weapp-tailwindcss/core";
import { getWeappFileFinalExtensions } from "@/weapp/platform";
import { WeappDevContext } from "@/utils/context/initContext";

const ctx = createContext({ logLevel: "silent" });

export async function createViteDevServer() {
  const configFile = await loadConfigFromFile({
    command: "build",
    mode: "",
  });

  const buildConfig = mergeConfig(configFile?.config || {}, {
    ...getDefaultViteConfig(
      FastGlob.globSync([
        // src下的wxss相关文件
        ...getAllWxssSrcPaths(),
        "!node_modules",
      ]),
    ),
    plugins: [
      {
        name: "write-to-dist",

        async transform(code: string, id: string) {
          if (id.includes("node_modules")) return;

          let dist = "";
          const wxssExt = WeappCssProcessorList.find((item) => id.endsWith(item));
          if (wxssExt) {
            // 转换src目录到dist目录
            dist = replaceSrcToDist(replaceFileExt(id, getWeappFileFinalExtensions().wxss), {
              fromDir: WeappDevContext.config.srcRoot,
              toDir: WeappDevContext.config.outDir,
            });

            // 需要转换tw class
            if (id.endsWith(`app.${wxssExt}`)) {
              code = (await ctx.transformWxss(code)).css;
            }
          }

          if (dist) {
            mkdirSync(dirname(dist), { recursive: true });
            writeFileSync(dist, code);
          }
          return code;
        },
      } as Plugin,
    ],
  });
  return await createServer(buildConfig);
}
