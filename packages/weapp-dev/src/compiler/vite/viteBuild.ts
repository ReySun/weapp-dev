import { getWxssViteConfig } from "./viteConfig";

/**
 * 构建生产环境 wxss
 */
export async function viteWxssBuild() {
  const { build } = await import("vite");
  const buildConfig = await getWxssViteConfig(true);
  await build(buildConfig);
}
