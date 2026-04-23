// 版本
export { WEABB_DEV_VERSION as version } from "./constants/version";

// 构建全部
export { buildAllTasks } from "@/cli/tasks";

// 单个构建
export { copyAssets as copyJsonAndJs } from "@/compiler/copy/copyAssets";
export { buildWeappAllNpm } from "@/compiler/npm/buildNpm";
export { compileAllTs } from "@/compiler/typescript/compileTs";
export { transformAllWxmlFiles } from "@/compiler/wxml/transformWxml";
export { compileAllWxss } from "@/compiler/wxss/compileWxss";

// 有用的工具函数
export { copy, resolveCopyEntries, resolveCopyEntry } from "@/compiler/copy/copy";
