import { LogLevel } from "vite";
import { CopyOptions, CopyOptionsFn } from "@/compiler/copy/copy";
import { WeappCssProcessorKey } from "@/weapp/wxss";
import { WeappPlatform } from "@/weapp/platform";
import { createContext } from "weapp-tailwindcss/core";

/**
 * WeappDev 开发配置
 */
export interface WeappDevConfig {
  /**
   * 应用入口目录（`app.json` 所在目录）。
   * ts 模板在 `miniprogram` 目录；
   * @default 'src'
   */
  srcRoot?: string;

  /**
   * 输出目录
   * @default 'dist'
   */
  outDir?: string;

  /**
   * 是否清输出目录
   * @default true
   */
  emptyOutDir?: boolean;

  /**
   * 日志级别
   * @default 'info'
   */
  logLevel?: LogLevel;

  /**
   * The working directory of the config file.
   * - Defaults to `process.cwd()` for root config.
   * - Defaults to the package directory for workspace config.
   */
  cwd?: string;

  /**
   * WXML 转换中间件
   */
  transformWxmlMiddleware?: (code: string) => string;

  /**
   * 平台
   * @default 'weapp'
   */
  platform?: WeappPlatform;

  /**
   * 输出格式
   * @default 'esm'
   */
  format?: "esm" | "cjs";

  /**
   * WeappDev CSS 处理器 less scss sass styl stylus postcss
   *
   * @default 'less'
   */
  cssProcessor?: WeappCssProcessorKey;

  /**
   * Copy files to another directory.
   * @example
   * ```ts
   * [
   *   'src/assets',
   *   'src/env.d.ts',
   *   'src/styles/**\/*.css',
   *   { from: 'src/assets', to: 'dist/assets' },
   *   { from: 'src/styles/**\/*.css', to: 'dist', flatten: true },
   * ]
   * ```
   */
  copy?: CopyOptions | CopyOptionsFn;

  weappTwConfig?: Parameters<typeof createContext>[0];
}

export const DefaultWeappDevConfig: WeappDevConfig = {
  srcRoot: "src",
  outDir: "dist",
  logLevel: "info",
  platform: "weapp",
  format: "esm",
  cssProcessor: "less",
  emptyOutDir: true,
  weappTwConfig: {},
};
