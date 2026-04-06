import { compileWxss } from "@/compiler/wxss/compileStyle";
import { transformWxmlFile } from "@/compiler/wxml/transformWxml";
import chokidar from "chokidar";
import { resolve } from "node:path";
import { compileTs } from "@/compiler/typescript/compileTs";
import { getAllWxmlExts } from "@/weapp/wxml";
import { WeappCssProcessorList } from "@/weapp/wxss";
// import { debounce } from "lodash-es";
// import { Stats } from "node:fs";

export function watchDev() {
  console.log("开始监听...");
  const watcher = chokidar.watch("src/**/*", {
    usePolling: false,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      // pollInterval: 50,
    },
  });

  watcher.on("change", async (path) => {
    console.log("change: ", path);
    const fileExt = path.split(".").pop();

    // wxml系列
    if (getAllWxmlExts().includes(fileExt)) {
      transformWxmlFile(resolve(process.cwd(), path), true);
    }
    // wxss系列
    else if (WeappCssProcessorList.includes(fileExt as any)) {
      compileWxss(resolve(process.cwd(), path));
    }
    // ts文件
    else if (path.endsWith(".ts")) {
      compileTs(path);
    }
  });

  watcher.on("add", async (_path) => {
    // console.log("add: ", path);
  });

  watcher.on("unlink", async (path) => {
    console.log("unlink: ", path);
  });

  watcher.on("unlinkDir", async (path) => {
    console.log("unlinkDir: ", path);
  });
}

// const debounceWatch = debounce(
//   (path: string, stats?: Stats) => {
//     // transformWxmlFile(resolve(process.cwd(), path));
//     console.log("debounce change: ", path);
//     if (path.endsWith(".wxml")) {
//       transformWxmlFile(resolve(process.cwd(), path));
//     }
//   },
//   500,
//   { leading: true, trailing: false },
// );
