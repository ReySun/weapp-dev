import { DefaultWeappDevConfig, WeappDevConfig } from "@/config/weappDevConfig";
import { createViteDevServer } from "@/watcher/viteDevServer";
import { merge } from "lodash-es";

import {
  loadConfigFromFile,
  UserConfig as ViteUserConfig,
  ViteDevServer,
} from "vite";

interface IWeappDevCtx {
  viteConfig?: ViteUserConfig;
  viteDevServer?: ViteDevServer;
  config: WeappDevConfig;
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
  // vite dev server实例
  WeappDevContext.viteDevServer = await createViteDevServer();

  // 合并 WeappDev 配置
  WeappDevContext.config = merge(
    DefaultWeappDevConfig,
    viteConfigFile?.config.weapp || {},
  );
};
