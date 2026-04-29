# Asset Replace Demo

本示例演示 `weapp-dev` 的静态资源路径替换功能。

## 功能说明

在 `vite.config.ts` 中配置 `assets`：

```ts
assets: {
  include: ["/assets/images/**/*.{png,jpg,jpeg}", "/assets/icons/*.png"],
  cdnPrefix: "https://cdn.example.com",
  dev: {
    enabled: true, // dev 模式也启用路径替换
  },
}
```

## 替换范围

### WXML

- `src="/assets/images/banner.png"` -> `src="https://cdn.example.com/assets/images/banner.png"`
- `style="background-image: url(/assets/images/banner.png)"` -> 同上

### WXSS

- `background-image: url("/assets/images/banner.png")` -> `url("https://cdn.example.com/assets/images/banner.png")`

### JS/TS

- `const banner = "/assets/images/banner.png"` -> `"https://cdn.example.com/assets/images/banner.png"`

## 开发模式

`dev.enabled: true` 时：

- 路径替换为 `http://localhost:3000/...`
- viteDevServer 自动 serve `src/assets` 和 `public/assets` 下的资源

## 生产模式

`weapp-dev build` 时：

- 路径替换为配置的 `cdnPrefix`
