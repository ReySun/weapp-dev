import { defineConfig, type Format } from "tsdown";

export default defineConfig((options) => {
  const { watch } = options;
  return {
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
