# weapp-dev

> 小程序原生开发增强工具

## 功能特性

- **TypeScript 支持**：原生支持 TypeScript 编译，基于 `tsdown`（rolldown 驱动）实现快速 bundling，开发模式支持 watch 增量编译
- **Vite 集成**：基于 Vite 的 WXSS 编译管道，开发时启动 Vite 开发服务器处理样式热更新
- **Tailwind CSS 支持**：内置 `weapp-tailwindcss`，支持 WXML 模板中的 Tailwind 类名自动转义和 WXSS 生成
- **WXML/WXSS 编译**：完整的小程序模板和样式处理，支持 Less/Scss 等预处理器
- **npm 依赖支持**：基于 `miniprogram-ci` 自动构建 npm 包
- **分包支持**：TS 编译时自动识别小程序分包结构，智能代码拆分
- **热更新**：开发时提供快速的增量编译和热更新体验

## 安装

```bash
npm install -D weapp-dev
# 或
pnpm add -D weapp-dev
```

## 快速开始

### 1. 创建配置文件

在项目根目录创建 `vite.config.ts`：

```ts
import { defineConfig } from "weapp-dev/config";

export default defineConfig({
  weapp: {
    srcRoot: "src", // app.json 所在目录，默认 'src'
    outDir: "dist", // 输出目录，默认 'dist'
    cssProcessor: "less", // CSS 预处理器，默认 'less'
  },
});
```

### 2. 开发模式

```bash
npx weapp-dev dev
# 或
npx wd dev
```

启动开发服务器，监听文件变更并自动重新编译。

### 3. 生产构建

```bash
npx weapp-dev build
# 或
npx wd build
```

执行全量构建，输出到 `dist` 目录。

## CLI 命令

| 命令                            | 别名  | 描述           |
| ------------------------------- | ----- | -------------- |
| `weapp-dev` / `weapp-dev serve` | `dev` | 启动开发服务器 |
| `weapp-dev build`               | -     | 构建生产版本   |

### 构建选项

```bash
# 构建全部
wd build

# 仅构建指定类型（ts | wxss | wxml | copy | npm）
wd build ts
wd build ts wxss

# 清空输出目录后构建
wd build --empty
wd dev --empty
```

## 配置选项

在 `vite.config.ts` 的 `weapp` 字段中配置：

```ts
import { defineConfig } from "weapp-dev/config";

export default defineConfig({
  weapp: {
    // 应用入口目录（app.json 所在目录）
    srcRoot: "src",

    // 输出目录
    outDir: "dist",

    // 构建前是否清空输出目录
    emptyOutDir: true,

    // 日志级别
    logLevel: "info",

    // 平台
    platform: "weapp",

    // 输出格式: 'esm' | 'cjs'
    format: "esm",

    // CSS 预处理器: 'less' | 'scss' | 'sass' | 'styl' | 'stylus' | 'postcss'
    cssProcessor: "less",

    // 复制文件配置
    copy: ["src/assets", "src/env.d.ts", { from: "src/assets", to: "dist/assets" }],

    // weapp-tailwindcss 配置
    weappTwConfig: {
      customAttributes: {
        "*": [/[a-z]+Class|[^-\s]+-class|className/],
      },
    },

    // npm 构建配置
    npm: {
      enable: true, // 是否启用 npm 构建
      cache: true, // 是否缓存 npm 构建结果
      subPackages: {
        // 子包依赖分配
        sub1: { dependencies: ["mp-html"] },
        sub2: { dependencies: ["dayjs"] },
      },
    },
  },
});
```

### Vite 配置扩展

`weapp-dev` 兼容部分 Vite 配置，可以在同一配置文件中编写标准 Vite 配置（如 `resolve.alias`、`define` 等），这些配置会自动传递给底层构建工具。

```ts
import { defineConfig } from "weapp-dev/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __VERSION__: JSON.stringify("1.0.0"),
  },
  weapp: {
    srcRoot: "src",
  },
});
```

## 构建流程

`weapp-dev` 的构建按以下顺序执行 5 个阶段：

1. **NPM 构建** — 使用 `miniprogram-ci` 构建 npm 依赖
2. **WXSS 编译** — 通过 Vite + `weapp-tailwindcss/vite` 编译样式，输出 `.wxss`
3. **WXML 转译** — 使用 `weapp-tailwindcss/core` 转义 Tailwind 类名；自动检测 Vant 组件并注册到 page.json
4. **资源复制** — 复制 JSON/JS 等静态资源
5. **TS 编译** — 使用 `tsdown` 编译 TypeScript，支持自动分包代码拆分

## 技术栈

- [Vite](https://vitejs.dev/) — 构建工具与开发服务器
- [tsdown](https://github.com/rolldown/tsdown) — TypeScript 编译（基于 rolldown）
- [miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html) — 微信开发者工具 CI
- [weapp-tailwindcss](https://github.com/sonofmagic/weapp-tailwindcss) — 小程序 Tailwind CSS 适配

## 项目结构要求

```
project/
├── src/                    # 源码目录（可配置 srcRoot）
│   ├── app.ts
│   ├── app.json
│   ├── app.wxss
│   ├── pages/
│   │   └── index/
│   │       ├── index.ts
│   │       ├── index.json
│   │       ├── index.wxml
│   │       └── index.wxss
│   └── package.json        # 声明 npm 依赖
├── vite.config.ts          # weapp-dev 配置文件
└── dist/                   # 构建输出目录
```

## 注意事项

- **分包编译尚不稳定**：TypeScript 分包编译功能仍在完善中
- **unbundle 模式**：启用 `tsdown.unbundle` 后项目较大时可能导致微信开发者工具异常（JS 文件过多引起）
- **本工具处于 Beta 阶段**，API 和功能可能会发生变化，请谨慎在生产环境中使用

## 示例项目

查看 [`examples/basic-ts-tw`](../../examples/basic-ts-tw) 获取完整的使用示例，包含：

- TypeScript + Less + Tailwind CSS 配置
- `vite.config.ts` 配置示例
- Vant Weapp 组件使用

## 许可证

MIT
