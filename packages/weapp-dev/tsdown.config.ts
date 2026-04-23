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
    format: ["esm", "cjs"] as Format[],
    clean: !watch,
    report: !watch,
    dts: {
      tsgo: true,
    },
    minify: !watch,
    hash: false,
    unbundle: false,
    deps: {
      skipNodeModulesBundle: true,
    },
  };
});
