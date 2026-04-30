# weapp-dev

微信小程序原生开发增强工具 monorepo。

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
