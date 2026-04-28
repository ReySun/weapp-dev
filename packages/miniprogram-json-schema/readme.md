# miniprogram-json-schema

微信小程序 JSON Schema 与 TypeScript 类型定义集合。

## 为什么做它

开发微信小程序时，`app.json`、`page.json` 等配置文件没有原生类型支持，有两个痛点：

1. **VS Code 中没有智能提示**：写 `app.json` 时容易拼错字段、用错类型，只能靠文档对照或运行时报错发现。
2. **TypeScript 项目中无法类型化引用**：如果在构建脚本或工具链中读取 `app.json`，无法获得类型校验和 IDE 自动补全。

这个包同时解决这两个问题：

- 提供官方 JSON Schema，可直接配置到 VS Code 获得实时校验和提示
- 基于 Schema 生成 TypeScript 类型定义，供任意 TS 项目导入使用

## Schema 来源

所有 JSON Schema 文件均提取自**微信开发者工具内置的 JSON Schema**，原始位置：

| 文件                          | 微信开发者工具中的原始路径                            |
| ----------------------------- | ----------------------------------------------------- |
| `app.json`                    | `editor-extension/app.schema.json`                    |
| `ext.json`                    | `editor-extension/ext.schema.json`                    |
| `game.json`                   | `editor-extension/game.schema.json`                   |
| `plugin.json`                 | `editor-extension/plugin.schema.json`                 |
| `project.config.json`         | `editor-extension/project.config.schema.json`         |
| `project.private.config.json` | `editor-extension/project.private.config.schema.json` |
| `sitemap.json`                | `editor-extension/sitemap.schema.json`                |
| `container.config.json`       | `editor-extension/container.config.schema.json`       |
| `theme.json`                  | `editor-extension/theme.schema.json`                  |
| `page_component.json`         | `editor-extension/page_component.schema.json`         |

> 基础路径：`https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json`

当微信更新开发者工具、Schema 发生变更时，发布时会同步跟进。

## 安装

```bash
npm install @weapp-dev/miniprogram-json-schema --save-dev
```

## 使用方式

### 方式一：VS Code 中获得 JSON 智能提示

本包内置了 VS Code 的 `settings.json` 配置模板，位于 `.vscode/settings.json`。你可以直接复制到你的小程序项目根目录：

```bash
# 将包内的 VS Code 配置复制到你的项目，如果你已有.vscode目录，建议手动复制
mkdir -p .vscode
cp node_modules/@weapp-dev/miniprogram-json-schema/.vscode/settings.json .vscode/settings.json
```

或者手动创建 `.vscode/settings.json`，写入以下内容：

```json
{
  "settings": {
    "json.schemas": [
      {
        "fileMatch": ["app.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/app.schema.json"
      },
      {
        "fileMatch": ["ext.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/ext.schema.json"
      },
      {
        "fileMatch": ["game.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/game.schema.json"
      },
      {
        "fileMatch": ["plugin.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/plugin.schema.json"
      },
      {
        "fileMatch": ["project.config.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/project.config.schema.json"
      },
      {
        "fileMatch": ["project.private.config.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/project.private.config.schema.json"
      },
      {
        "fileMatch": ["sitemap.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/sitemap.schema.json"
      },
      {
        "fileMatch": ["container.config.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/container.config.schema.json"
      },
      {
        "fileMatch": ["theme.json"],
        "url": "https://dldir1.qq.com/WechatWebDev/editor-extension/wx-json/theme.schema.json"
      },
      {
        "fileMatch": [
          "*.json",
          "!/settings.json",
          "!/config.json",
          "!/app.json",
          "!/ext.json",
          "!/game.json",
          "!/plugin.json",
          "!/project.config.json",
          "!/sitemap.json",
          "!/container.config.json",
          "!/.eslintrc.*",
          "!project.private.config.json",
          "!/theme.json"
        ],
        "url": "https://dldir1.qq.com/WechatWebDev/plugins/editor/wechat-miniprogram_wx-json/1.0.0/page_component.schema.json"
      }
    ]
  }
}
```

配置完成后，在 VS Code 中打开对应的 JSON 文件即可获得：

- **字段自动补全**
- **悬停提示**
- **类型校验与报错**
- **枚举值提示**（如 `navigationBarTextStyle` 的 `"black"` / `"white"`）

### 方式二：TypeScript 项目中导入类型

```typescript
// 按需导入具体配置类型
import type { WeappAppJson, WeappPageComponentJson } from "@weapp-dev/miniprogram-json-schema";
```

## 参考文档：

- https://jiaoxin2005.github.io/blogs/2022/2-17.html#%E5%B0%8F%E7%A8%8B%E5%BA%8F-app-json-%E5%A2%9E%E5%8A%A0%E8%AF%AD%E6%B3%95%E6%8F%90%E7%A4%BA
