# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pnpm monorepo for WeChat Mini Program (微信小程序) development tooling.

- `packages/weapp-dev` — Main CLI tool (`wd` / `weapp-dev`) that compiles TypeScript, WXSS, WXML, and handles npm dependencies for mini program projects.
- `packages/miniprogram-json-schema` — JSON Schemas and generated TypeScript types for WeChat Mini Program config files (app.json, page.json, project.config.json, etc.).

## Common Commands

### Root (monorepo-wide)

```bash
# Lint with oxlint
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format with oxfmt
pnpm fmt

# Check formatting
pnpm fmt:check

# Install dependencies
pnpm install
```

### weapp-dev package

```bash
cd packages/weapp-dev

# Development build with watch mode
pnpm dev

# Production build (outputs dist/ with dual CJS/ESM)
pnpm build
```

### miniprogram-json-schema package

```bash
cd packages/miniprogram-json-schema

# Regenerate TS types from JSON schemas (requires tsx)
pnpm weappJsonToTs

# Build package
pnpm build
```

## Architecture

### Build Pipeline (`packages/weapp-dev/src/cli/tasks.ts`)

The CLI executes 5 sequential build tasks (in this order):

1. **NPM** (`compiler/npm/buildNpm.ts`) — Uses `miniprogram-ci` to build npm dependencies for the mini program.
2. **WXSS** (`compiler/wxss/compileWxss.ts`) — Compiles styles via Vite + `weapp-tailwindcss/vite`, outputting `.wxss` files with `preserveModules`.
3. **WXML** (`compiler/wxml/transformWxml.ts`) — Transforms Tailwind CSS classes in WXML templates using `weapp-tailwindcss/core`. Auto-detects and registers Vant components in page JSON files.
4. **Copy** (`compiler/copy/copyAssets.ts`) — Copies JSON/JS and other static assets from `srcRoot` to `outDir`.
5. **TS** (`compiler/typescript/compileTs.ts`) — Compiles TypeScript via `tsdown` (rolldown-based) with custom Vite plugins.

In development (`weapp-dev dev`), TS compilation runs in watch mode. In production (`weapp-dev build`), all tasks run once.

### Config System

Config is loaded from the user's `vite.config.ts` via Vite's `loadConfigFromFile`. The `weapp` field extends Vite's `UserConfig`:

```ts
// vite.config.ts
import { defineConfig } from 'weapp-dev/config'

export default defineConfig({
  weapp: {
    srcRoot: 'src',      // app.json directory
    outDir: 'dist',
    cssProcessor: 'less',
    // ...
  }
})
```

The merged config lives in `WeappDevContext` (`config/mergedConfig.ts`), which also holds the Vite config and `weapp-tailwindcss` context.

### TypeScript Compiler (tsdown)

TS compilation uses `tsdown` (a rolldown-based TypeScript bundler) with three custom Vite plugins:

- `vitePluginAutoWeappSplitChunk` — Auto-splits chunks for mini program subpackages.
- `vitePluginDeleteEmptyExport` — Removes empty exports.
- `vitePluginRewritePnpmImport` — Rewrites pnpm-style imports for compatibility.

### WXSS Compiler (Vite-based)

WXSS compilation uses a Vite build server (`compiler/vite/viteDevServer.ts`) with:
- `UnifiedViteWeappTailwindcssPlugin` from `weapp-tailwindcss/vite`
- `preserveModules: true` to maintain file structure
- `assetFileNames` renames `.css` to `.wxss`

### Worker System

A child-process task manager (`worker/taskManager.ts`) forks `worker/process.ts` for isolated compilation tasks. Currently defined but rarely used in practice — most compilation runs in the main process.

### Path Aliases

- `@/` maps to `./src/*` in `packages/weapp-dev`
- `verbatimModuleSyntax: true` is enabled — use `import type` for type-only imports

### Lint/Format Rules

- Oxlint config in `oxlint.config.ts` — ignores `examples/`, `.claude/`, `.trae/`, `.agents/`
- `@typescript-eslint/consistent-type-imports` is enforced
- `no-useless-catch` and `no-useless-empty-export` are disabled
- Oxfmt sorts imports and Tailwind classes

## Dependency Notes

- `pnpm-workspace.yaml` uses `shamefullyHoist: true`
- `catalog:` entries in workspace root manage shared dependency versions
- `packageManager` is pinned to `pnpm@10.24.0`
