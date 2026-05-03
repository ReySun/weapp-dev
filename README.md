# weapp-dev

> 微信小程序原生开发增强工具。保留 Vite 的 TypeScript / 样式编译能力，同时实现真正的增量构建——改 WXML 不用等 TS 重编。

> 顺便说一句，如果是新开项目，不是特别在意性能和代码体积的话，可以优先考虑uniapp/tarojs/weapp-vite的wevu哦，他们已经做的够好了。

## 为什么做它？

2026 年了，真的还会有人做小程序增强开发工具？

说来话长。我们团队维护着一个原生 TypeScript 微信小程序，早期用自定义 Gulp 管理构建流程，后来引入了 `weapp-tailwindcss` 处理样式。Gulp 的增量更新在当时还行，但随着项目膨胀，首次编译 TS 的时间越来越长，而它对小程序分包的支持也相对薄弱。

之后遇见了 [`weapp-vite`](https://github.com/weapp-vite/weapp-vite)，接入后最满意的是它对 TS 分包的适配。但用久了发现一个致命问题：**每次修改 WXML 或 Less，都会触发全量重新编译（TS + WXML + Less）**。哪怕只是给按钮加了一个 `bindtap`，也要干等十几秒。想回退 Gulp，又舍不得 Vite 生态对 TS 和 Tailwind 的支持。

所以我们做了 `weapp-dev`——**把构建拆成独立阶段（NPM → WXSS → WXML → Copy → TS），按需执行，互不阻塞**。改样式只编译样式，改模板只处理模板，TS 只有在代码层变更时才介入。既保留 Vite 的现代化编译体验，又拿回 Gulp 时代"秒级反馈"的快感。

## 关于本项目

本项目部分代码及 README 文档由 AI 辅助共同开发完成。如果在使用中发现问题或有改进建议，欢迎提交 [Issue](https://github.com/sonofmagic/weapp-dev/issues) 反馈，也欢迎 Fork 仓库一起参与维护。

## Packages

| Package                                                                    | 说明                                                    | 版本                                                                                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [`weapp-dev`](./packages/weapp-dev)                                        | CLI 工具，支持 TypeScript / WXSS / WXML 编译及 npm 构建 | [![npm](https://img.shields.io/npm/v/weapp-dev)](https://www.npmjs.com/package/weapp-dev)                                                   |
| [`@weapp-dev/miniprogram-json-schema`](./packages/miniprogram-json-schema) | 微信小程序配置文件的 JSON Schema 及 TS 类型定义         | [![npm](https://img.shields.io/npm/v/@weapp-dev/miniprogram-json-schema)](https://www.npmjs.com/package/@weapp-dev/miniprogram-json-schema) |

## 快速开始

```bash
# 安装 CLI
npm install -g weapp-dev

# 开发模式（监听文件变更）
wd dev / weapp-dev dev

# 生产构建
wd build / weapp-dev build
```

## 开发

```bash
# 安装依赖
pnpm install

# 格式化代码
pnpm fmt

# 代码检查
pnpm lint
```
