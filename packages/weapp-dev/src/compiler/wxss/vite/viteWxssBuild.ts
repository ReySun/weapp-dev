import { build } from "vite";

import { getWxssViteConfig } from "./viteWxssConfig";

/**
 * 构建生产环境 wxss
 */
export async function viteWxssBuild() {
  const buildConfig = await getWxssViteConfig(true);
  await build(buildConfig);
}
