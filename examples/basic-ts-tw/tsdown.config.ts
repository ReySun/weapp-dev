import { defineConfig } from "tsdown";
import { build } from "vite";
import glob from "fast-glob";

export default defineConfig(() => {
  return {
    entry: ["./src/**/*.ts"],
    // entry: {
    //   'src/components/wp-tabs/wp-tabs': "src/src/components/wp-tabs/wp-tabs.ts",
    // },
    format: ["es"],
    watch: true,
    clean: true,
    report: false,
    dts: false,
    minify: false,
    unbundle: false,
    // copy: [{ from: "src/**\/*.json", to: "dist", flatten: false }],
    outExtensions({}) {
      return {
        js: ".js",
        dts: ".d.ts",
      };
    },
    onBuildEnd() {
      console.log("onBuildEnd");
      viteBuild();
    },
  };
});

async function viteBuild() {
  console.time("viteBuild");
  await build({
    root: "./src",
    configFile: false,
    build: {
      rolldownOptions: {
        preserveEntrySignatures: "allow-extension",
        // 不提供任何 JS 入口
        input: [
          ...glob.globSync("./src/**/*.ts"),
          // ...less,
          // ...all,
          // ...wxml
          // appJs,
        ],
        output: {
          sourcemap: false,
          minify: false,
          preserveModules: true,
          preserveModulesRoot: "src",
        },
      },
    },
  });
  console.timeEnd("viteBuild");
}
