---
"weapp-dev": patch
---

### Features

- 增强 vite 文件监视功能，支持外部 TS 依赖变更触发重编译
- dev 模式下 vite 始终保持 devServer 状态

### Fixes

- 优化类型定义，增强代码可读性和类型安全

### Performance

- 优化 dev 模式文件监听逻辑，取消 tsdown watch 配置
- 增加对 src 目录下文件变化的判断，优化文件事件处理逻辑

### Documentation

- 更新项目仓库链接，修正为正确的 GitHub 地址
