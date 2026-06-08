import { readFileSync } from "node:fs";
import { defineConfig, type Format } from "tsdown";

export default defineConfig((options) => {
  const { watch } = options;
  const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
  return {
    env: {
      WEAPP_DEV_VERSION: pkg.version,
    },
    entry: {
      index: "src/index.ts",
      cli: "src/cli.ts",
      worker: "src/worker.ts",
      config: "src/config.ts",
      lodashFix: "src/lodashFix.ts",
    },
    format: watch ? "esm" : (["esm", "cjs"] as Format[]),
    clean: !watch,
    report: !watch,
    dts: {
      tsgo: true,
    },
    minify: !watch,
    hash: !watch,
    unbundle: false,
    publint: true,
  };
});
