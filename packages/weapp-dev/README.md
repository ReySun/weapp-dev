# weapp-dev

> 小程序原生开发增强工具

## 功能特性

- **TypeScript 支持**：原生支持 TypeScript 编译，基于 `tsdown`（rolldown 驱动）实现快速 bundling，开发模式支持 watch 增量编译
- **Vite 集成**：基于 Vite 的 WXSS 编译管道，开发时启动 Vite 开发服务器处理样式热更新
- **Tailwind CSS 支持**：内置 `weapp-tailwindcss`，支持 WXML 模板中的 Tailwind 类名自动转义和 WXSS 生成
- **WXML/WXSS 编译**：完整的小程序模板和样式处理，支持 Less/Scss 等预处理器
- **npm 依赖支持**：基于 `miniprogram-ci` 自动构建 npm 包
- **分包支持**：TS 编译时自动识别小程序分包结构，伪智能代码拆分
- **静态资源 CDN**：支持将包内静态资源外置到 CDN，有效减少主包体积
- **热更新**：开发时提供快速的增量编译和热更新体验

## 安装

```bash
npm install -D weapp-dev
# 或
pnpm add -D weapp-dev
```

> `wd` 是 `weapp-dev` 的命令缩写，以下文档中两者可以互换使用。

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

    // 复制文件配置。配置与 tsdown 的 copy 配置一致，与 tsdown 不同的是，开发环境会监听文件新增之后如果满足条件则增量复制
    // 注意：js/wxs/json 内部已处理，配置 copy 时应忽略该类文件
    // https://tsdown.dev/options/config-file
    copy: ["src/assets", "src/env.d.ts", { from: "src/assets", to: "dist/assets" }],

    // weapp-tailwindcss 配置
    // 如果没有 tw 相关配置或者依赖，则不会启用
    // https://www.npmjs.com/package/weapp-tailwindcss
    // https://tw.icebreaker.top/docs/api/options/important
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
        // 子包依赖分配：将依赖仅分配到指定子包，主包中将不会存在该依赖
        sub1: { dependencies: ["mp-html"] },
        sub2: { dependencies: ["dayjs"] },
      },
    },

    // 静态资源 CDN 配置
    // 将小程序包内静态资源外置到 CDN，减少包体积
    cdn: {
      // 需要外置的静态资源目录，不需要写 `/` 前缀
      dirs: ["assets", "static"],
      // 生产环境 CDN 地址前缀
      url: "https://cdn.example.com",
      // 开发环境配置
      dev: {
        // 是否启用开发环境路径替换，默认 false
        // 启用后开发时使用 Vite 本地服务提供资源（优先 ip4，其次 localhost）
        // 手机真机预览时需开启电脑代理；否则应禁用并配置 url 让开发环境也走线上/测试 CDN
        enabled: false,
        // 自定义开发前缀，默认使用 viteDevServer 地址
        prefix: "http://192.168.1.100:3000",
      },
    },
  },
});
```

### Vite 配置扩展

`weapp-dev` 目前仅兼容以下 Vite 配置字段，可直接在配置文件的根层级编写：

| 字段            | 说明                                                           |
| --------------- | -------------------------------------------------------------- |
| `env`           | 编译时环境变量，可通过 `import.meta.env` 或 `process.env` 访问 |
| `envFile`       | 指定 `.env` 文件路径，如 `.env.production`                     |
| `envPrefix`     | 暴露到客户端源码的环境变量前缀，默认 `['VITE_', 'TSDOWN_']`    |
| `define`        | 全局变量替换，tsdown.define                                    |
| `server`        | 开发服务器配置, 如port等                                       |
| `resolve.alias` | alias默认会使用tsconfig的paths                                 |

**其他 Vite 标准配置字段均不支持**，请勿在配置文件中随意使用，否则可能引发不可预期的行为。

```ts
import { defineConfig } from "weapp-dev/config";

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify("1.0.0"),
  },
  envPrefix: ["APP_", "VITE_"],
  envFile: ".env.local",
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
- **CDN 开发环境**：启用 `cdn.dev.enabled` 后，开发时静态资源走本地 Vite 服务，手机真机预览需开启代理；否则建议禁用 `cdn.dev.enabled` 并配置 `cdn.url`，让开发环境也走线上/测试 CDN 地址
- **CDN 与 copy 配置**：启用 CDN 后，框架会自动处理资源复制逻辑，`weapp.copy` 中应尽量避免手动配置复制 CDN 目录下的文件
- **本工具处于 Beta 阶段**，API 和功能可能会发生变化，请谨慎在生产环境中使用

## 示例项目

查看 [`examples/basic-ts-tw`](../../examples/basic-ts-tw) 获取完整的使用示例，包含：

- TypeScript + Less + Tailwind CSS 配置
- `vite.config.ts` 配置示例
- Vant Weapp 组件使用

## 许可证

MIT
