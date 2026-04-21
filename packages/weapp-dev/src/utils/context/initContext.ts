import { merge } from "lodash-es";
import { loadConfigFromFile, UserConfig as ViteUserConfig, ViteDevServer } from "vite";
import { createContext } from "weapp-tailwindcss/core";

import { DefaultWeappDevConfig, WeappDevConfig } from "@/config/weappDevConfig";
import { createViteDevServer } from "@/watcher/viteDevServer";
import { getAllWxssSrcPaths } from "@/weapp/wxss";

interface IWeappDevCtx {
  viteConfig?: ViteUserConfig;
  viteDevServer?: ViteDevServer;
  config: WeappDevConfig;
  weappTwCtx?: ReturnType<typeof createContext>;
}

export const WeappDevContext: IWeappDevCtx = {
  viteConfig: null,
  viteDevServer: null,
  config: DefaultWeappDevConfig,
} as Readonly<IWeappDevCtx>;

export const initWeappDevContext = async (isDev = false) => {
  // 加载 vite 配置
  const viteConfigFile = await loadConfigFromFile({
    command: "build",
    mode: "",
  });
  // vite 配置
  WeappDevContext.viteConfig = viteConfigFile?.config || {};

  // 合并 WeappDev 配置
  WeappDevContext.config = merge({}, DefaultWeappDevConfig, viteConfigFile?.config.weapp || {});

  // 初始化 weapp tailwindcss 上下文
  WeappDevContext.weappTwCtx = createContext(WeappDevContext.config.weappTwConfig);

  // vite dev server实例
  if (isDev) {
    console.time("initWeappDevContext viteDevServer");
    WeappDevContext.viteDevServer = await createViteDevServer();
    // const styles = await getAllWxssSrcPaths();
    // await WeappDevContext.viteDevServer.transformRequest(styles[styles.length - 1]);
    console.timeEnd("initWeappDevContext viteDevServer");
  }

  return WeappDevContext;
};
