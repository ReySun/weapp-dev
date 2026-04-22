import { defineConfig, type Format } from "tsdown";

export default defineConfig(() => {
  return {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"] as Format[],
    clean: true,
    report: false,
    dts: {
      // tsgo: true,
    },
    copy: [
      {
        from: "src/**/*.json",
        to: "dist",
        flatten: false,
      },
    ],
    minify: false,
    hash: false,
    unbundle: false,
    deps: {
      skipNodeModulesBundle: true,
    },
  };
});
