import path, { resolve, basename } from "node:path";

import chokidar from "chokidar";
import { debounce } from "lodash-es";

import { copy } from "@/compiler/copy/copy";
import { getMatchedCopyEntry } from "@/compiler/copy/copyAssets";
import { compileTs } from "@/compiler/typescript/compileTs";
import { transformWxmlFile } from "@/compiler/wxml/transformWxml";
import { compileWxss } from "@/compiler/wxss/compileWxss";
import { WeappDevContext } from "@/config/mergedConfig";
import { fsCopy, fsRemove, fsStat } from "@/utils/fs/fs";
import { tsLogger, copyLogger, deleteLogger } from "@/utils/logger";
import { getWeappFileFinalExtensions } from "@/weapp/platform";
import { getAllWxmlExts } from "@/weapp/wxml";
import { WeappCssProcessorList } from "@/weapp/wxss";

// 防抖函数映射，以文件路径+事件作为键
const debounceHandlers = new Map<string, ReturnType<typeof debounce>>();

// 获取或创建防抖处理函数
function getDebounceHandler(path: string, event: string) {
  const key = `${path}:${event}`;
  if (!debounceHandlers.has(key)) {
    debounceHandlers.set(
      key,
      debounce(
        async () => {
          try {
            await handleFileEvent(path, event);
          } catch (error) {
            console.error(`处理文件事件失败 ${path}:`, error);
          } finally {
            // 处理完成后清理防抖函数，避免内存泄漏
            debounceHandlers.delete(key);
          }
        },
        200,
        { leading: false, trailing: true },
      ),
    );
  }
  return debounceHandlers.get(key)!;
}

// 处理文件事件的核心函数
async function handleFileEvent(path: string, event: string) {
  const fileExt = path.split(".").pop();
  const absolutePath = resolve(process.cwd(), path);
  // console.log(`absolutePath: ${absolutePath}, event: ${event}`);

  // 匹配需要copy的文件
  const matchedCopyEntry = await getMatchedCopyEntry(absolutePath);

  switch (event) {
    case "change":
    case "add":
      if (matchedCopyEntry) {
        await copy({
          copy: [matchedCopyEntry],
        });
        copyLogger.success(`${event}: ${path}`);
        return;
      }

      // wxml系列
      if (getAllWxmlExts().includes(fileExt)) {
        // wxmlLogger.info(`${event}: ${path}`);
        await transformWxmlFile(absolutePath, true);
      }
      // wxss系列
      else if (WeappCssProcessorList.includes(fileExt as any)) {
        // wxssLogger.info(`${event}: ${path}`);
        await compileWxss(absolutePath);
      }
      // ts文件
      else if (path.endsWith(".ts")) {
        const unbundle = WeappDevContext.config.tsdown?.unbundle ?? false;
        if (unbundle) {
          tsLogger.info(`${event}: ${path}`);
          await compileTs(path);
        }
        // TODO 必要时候，重启ts server
        // await compileAllTs(false);
        // console.log(`编译 TS ${await runTimeEnd(() => compileAllTs(false))}ms`);
      }
      // json文件
      else if (path.endsWith(".json")) {
        copyLogger.info(`${event}: ${path}`);
        await copyFile(absolutePath);
      }
      // wxs文件
      else if (path.endsWith(".wxs")) {
        copyLogger.info(`${event}: ${path}`);
        await copyFile(absolutePath);
      }
      break;

    case "unlink":
      // case "unlinkDir":
      if (matchedCopyEntry) {
        await cleanDistFileOrDirFromSrc(matchedCopyEntry.from);
      } else {
        await cleanDistFileOrDirFromSrc(path);
      }

      deleteLogger.info(`${event}: ${path}`);
      break;
  }
}

// 复制JSON文件到dist目录
async function copyFile(srcPath: string) {
  const { config } = WeappDevContext;
  const { srcRoot, outDir } = config;
  const distPath = srcPath.replace(new RegExp(`/${srcRoot}/`), `/${outDir}/`);

  await fsCopy(srcPath, distPath);
  copyLogger.success(`${basename(srcPath)} 复制完成`);
}

// 清理dist目录中的对应文件
async function cleanDistFileOrDirFromSrc(srcPath: string) {
  const { config } = WeappDevContext;
  const finalWxssExt = (await getWeappFileFinalExtensions()).wxss;

  const { srcRoot, outDir } = config;
  const distPath = srcPath
    .replace(new RegExp(`(/*)${srcRoot}/`), `$1${outDir}/`)
    .replace(/\.ts$/, ".js")
    .replace(new RegExp(`.(${WeappCssProcessorList.join("|")})$`), `.${finalWxssExt}`);

  const stat = await fsStat(distPath);
  if (!stat) return;

  await fsRemove(distPath);
  // console.log(`清理${stat.isFile() ? "文件" : "目录"} ${distPath}`);
}

export async function watchDev() {
  const { config } = WeappDevContext;

  let isReady = false;
  const srcRoot = path.resolve(`${config.srcRoot}`);
  const watcher = chokidar.watch([`${srcRoot}/**/*`], {
    usePolling: false,
    awaitWriteFinish: {
      stabilityThreshold: 100,
    },
  });

  watcher.on("change", (path) => {
    getDebounceHandler(path, "change")();
  });

  watcher.on("add", (path) => {
    // 只在ready事件触发后处理add事件，避免初始化时的大量事件
    if (isReady) {
      getDebounceHandler(path, "add")();
    }
  });

  watcher.on("unlink", (path) => {
    getDebounceHandler(path, "unlink")();
  });

  // watcher.on("unlinkDir", (path) => {
  //   getDebounceHandler(path, "unlinkDir")();
  // });

  watcher.on("error", (error) => {
    console.error("监听错误:", error);
  });

  watcher.on("ready", () => {
    isReady = true;
    console.log("监听就绪...");
  });
}
