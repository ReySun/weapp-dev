import { merge } from "lodash-es";
import type { UserConfig as ViteUserConfig, ViteDevServer } from "vite";
import { loadConfigFromFile } from "vite";
import { createContext } from "weapp-tailwindcss/core";

import type { WeappDevConfig } from "@/config/weappDevConfig";
import { DefaultWeappDevConfig } from "@/config/weappDevConfig";

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

export const initWeappDevContext = async () => {
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

  return WeappDevContext;
};
