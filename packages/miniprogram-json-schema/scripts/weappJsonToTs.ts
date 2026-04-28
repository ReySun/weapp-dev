import { readFileSync } from "fs";
import { platform } from "os";

import { compile } from "json-schema-to-typescript-lite";
import { format } from "oxfmt";

import OxFmtConfig from "../../../oxfmt.config";
import { ensureFile, toPascalCase } from "./utils";

interface JsonValidationItem {
  fileMatch: string | string[];
  url: string;
}

interface WeappJsonSchemaConfig {
  [key: string]: string;
}
let weappJsonSchemaConfig: WeappJsonSchemaConfig = {
  // "app.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/app.schema.json",
  // "ext.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/ext.schema.json",
  // "game.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/game.schema.json",
  // "plugin.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/plugin.schema.json",
  // "project.config.json":
  //   "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/project.config.schema.json",
  // "project.private.config.json":
  //   "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/project.private.config.schema.json",
  // "sitemap.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/sitemap.schema.json",
  // "container.config.json":
  //   "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/container.config.schema.json",
  // "theme.json": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/theme.schema.json",
};

/**
 * 获取本地微信小程序 JSON Schema 配置
 * @returns
 */
function getMacLocalWxJson() {
  let jsonValidation: JsonValidationItem[] | null = null;
  if (platform() === "darwin") {
    try {
      jsonValidation = JSON.parse(
        // 读取原始 wx-json 文件
        // 需要安装微信开发者工具才会有
        readFileSync(
          "/Applications/wechatwebdevtools.app/Contents/Resources/package.nw/js/libs/vseditor/extensions/wx-json/package.json",
          "utf-8",
        ),
      ).contributes.jsonValidation.filter(
        // 过滤出 fileMatch 为 package.json 或 bower.json 的项
        (item: JsonValidationItem) =>
          (typeof item.fileMatch === "string" &&
            !["package.json", "bower.json"].includes(item.fileMatch)) ||
          typeof item.fileMatch !== "string",
      );

      if (jsonValidation?.length) {
        weappJsonSchemaConfig = {};

        jsonValidation.forEach((item) => {
          const prop = item.url.split("/").pop()?.replace(".schema.", ".");
          if (prop) {
            weappJsonSchemaConfig[prop] = item.url;
          }
        });
      }

      return jsonValidation;
    } catch {}
  }
}

/**
 * 写入 VS Code 配置文件
 */
function writeVscodeSettings() {
  const jsonValidation = getMacLocalWxJson();

  const settings = {
    settings: {
      "json.schemas": jsonValidation?.map((item) => {
        return {
          fileMatch: Array.isArray(item.fileMatch) ? item.fileMatch : [item.fileMatch],
          url: item.url,
        };
      }),
    },
  };

  const file = ".vscode/settings.json";

  format(file, JSON.stringify(settings), OxFmtConfig).then(({ code }) => {
    ensureFile(file, code);
  });
}
// 提前执行，有副作用，确保 jsonSchemaToTs 之前
writeVscodeSettings();

type Platform = "weapp";

async function jsonSchemaToTs() {
  const jsonConfig: Record<Platform, WeappJsonSchemaConfig> = {
    // 微信小程序 JSON Schema 配置
    weapp: weappJsonSchemaConfig,
  };

  const files: string[] = [];
  for (const platform of Object.keys(jsonConfig) as Platform[]) {
    if (!Object.hasOwn(jsonConfig, platform)) continue;

    for (const jsonNameWithExt in jsonConfig[platform]) {
      if (!Object.hasOwn(jsonConfig[platform], jsonNameWithExt)) continue;

      try {
        const jsonUrl = jsonConfig[platform][jsonNameWithExt];

        const res = await fetch(jsonUrl);
        const jsonSchema = await res.json();

        // 写入本地 JSON Schema 文件
        ensureFile(
          `./src/schema/${platform}/${jsonNameWithExt.replace(".json", ".schema.json")}`,
          JSON.stringify(jsonSchema),
        );

        // 命名空间
        const NS = toPascalCase(`${platform}.${jsonNameWithExt}`);

        // 编译 JSON Schema 到 TypeScript
        const ts = await compile(jsonSchema, NS);
        const file = `./src/types/${platform}/${jsonNameWithExt}.ts`;
        const { code } = await format(file, ts, OxFmtConfig);
        ensureFile(file, code);
        files.push(file);
      } catch (error) {
        console.error(`编译 ${jsonNameWithExt} 失败:`, error);
      }
    }
  }

  if (files.length > 0) {
    console.log(`成功编译 ${files.length} 个文件`);
    const indexFile = "./src/index.ts";

    const { code } = await format(
      indexFile,
      `// @ts-nocheck\n${files.map((f) => `export * from "${f.replace("./src/", "./")}"`).join("\n")}`,
      OxFmtConfig,
    );
    ensureFile(indexFile, code);
  }
}

jsonSchemaToTs();
