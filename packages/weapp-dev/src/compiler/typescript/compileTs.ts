import { WeappDevContext } from "@/utils/context/initContext";
import { tsLogger } from "@/utils/logger";
import { build } from "tsdown";

export async function compileTs(input: string) {
  const start = Date.now();

  await build({
    entry: [input],
    root: "src",
    watch: false,
    logLevel: "silent",
    clean: false,
    report: false,
    dts: false,
    minify: false,
    unbundle: true,
    outDir: "dist",
  });

  const duration = Date.now() - start;
  tsLogger.success(`编译 TS 完成 (${duration}ms)`);
}

export async function compileAllTs(isProd: boolean = false) {
  console.log(WeappDevContext.config.copy);
  await build({
    entry: ["src/**/*.ts"],
    watch: !isProd,
    logLevel: "silent",
    format: WeappDevContext.config.format,
    clean: false,
    report: false,
    dts: false,
    minify: isProd,
    unbundle: !isProd,
    copy: WeappDevContext.config.copy as any,
    // copy: [{ from: "src/**\/*.json", to: "dist", flatten: false }],
    // outExtensions({}) {
    //   return {
    //     js: ".js",
    //     dts: ".d.ts",
    //   };
    // },
    // onSuccess(_, signal) {
    //   console.log("onSuccess");
    // },
    // hash: false,
    deps: {
      onlyBundle: ["lodash-es"], // 明确告诉它：我要打包它
    },
    outputOptions: {
      // chunkFileNames: "chunk-[hash].js",
      // manualChunks: (moduleId) => {
      //   console.log(moduleId);
      //   if (moduleId.includes("lodash-es")) {
      //     return "lodash-es";
      //   }
      //   return;
      // },
      // chunkFileNames:(chunkInfo)=>{
      //   console.log(chunkInfo);
      //   return
      // }
    },
  });
}
