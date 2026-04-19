import { defineConfig, type Format } from "tsdown";

export default defineConfig(() => {
  return {
    entry: {
      cli: "src/cli.ts",
      worker: "src/worker.ts",
      config: "src/config.ts",
      lodashFix: "src/lodashFix.ts",
    },
    format: ["esm", "cjs"] as Format[],
    clean: false,
    report: false,
    dts: {
      tsgo: true,
    },
    minify: false,
    hash: false,
    unbundle: false,
    deps: {
      skipNodeModulesBundle: true,
    },
  };
});
