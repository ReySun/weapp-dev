# weapp-dev

小程序原生开发增强工具

## ⚠️ Beta 阶段提醒

**该包仍处于 beta 阶段，API 和功能可能会发生变化。** 请谨慎在生产环境中使用。

## 功能特性

- **TypeScript 支持**: 原生支持 TypeScript 编译 (小程序分包尚不稳定)
- **Vite 集成**: 基于 Vite 的快速开发服务器
- **WXML/WXSS 编译**: 完整的小程序模板和样式处理
- **npm 依赖支持**: 支持 npm 包构建
- **热更新**: 开发时的快速热更新体验

## 安装

```bash
npm install -D weapp-dev
# 或
pnpm add -D weapp-dev
```

## 快速开始

### 开发模式

```bash
weapp-dev dev
```

### 生产构建

```bash
weapp-dev build
```

## CLI 命令

| 命令    | 描述           |
| ------- | -------------- |
| `serve` | 启动开发服务器 |
| `build` | 构建生产版本   |

## 技术栈

- Vite
- TypeScript (tsdown)
- miniprogram-ci

## 许可证

MIT
