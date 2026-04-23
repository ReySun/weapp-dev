import { LogLevel } from "vite";
import { createContext } from "weapp-tailwindcss/core";

import { CopyOptions, CopyOptionsFn } from "@/compiler/copy/copy";
import { WeappPlatform } from "@/weapp/platform";
import { WeappCssProcessorKey } from "@/weapp/wxss";

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

  npm?: WeappDevNpmConfig;

  tsdown?: {
    unbundle?: boolean;
  };
}

interface WeappDevNpmDependencies {
  dependencies: string[];
}

interface WeappDevNpmConfig {
  /**
   * 是否启用 npm 构建
   * @default true
   */
  enable?: boolean;
  /**
   * 是否缓存 npm 构建结果
   * @default true
   */
  cache?: boolean;
  /**
   * 主包依赖
   *
   * 一般不需要设置这个，package.json 中 dependencies的依赖会自动被添加到主包的依赖中。
   *
   * 设置了也没用，只要package.json 中 dependencies 有依赖便会打包。
   *
   * @deprecated
   */
  mainPackage?: WeappDevNpmDependencies;
  /**
   * 子包依赖
   *
   * 依赖仅在子包中使用时，可以这么设置。注意，设置子包的依赖后，主包中将不会存在该依赖。
   *
   * @example
   * ```ts
   * {
   *   sub1: {
   *     dependencies: ['mp-html'],
   *   },
   *   sub2: {
   *     dependencies: ['dayjs'],
   *   },
   * }
   * ```
   */
  subPackages?: Record<string, WeappDevNpmDependencies>;
}

export const DefaultWeappDevConfig: WeappDevConfig = {
  srcRoot: "src",
  outDir: "dist",
  logLevel: "info",
  platform: "weapp",
  format: "esm",
  cwd: process.cwd(),
  cssProcessor: "less",
  emptyOutDir: true,
  weappTwConfig: {
    customAttributes: {
      "*": [/[a-z]+Class|[^-\s]+-class|className/],
    },
    logLevel: "silent",
  },
  npm: {
    enable: true,
    cache: true,
  },
};
