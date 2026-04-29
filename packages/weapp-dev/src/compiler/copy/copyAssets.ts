import { WeappDevContext } from "@/config/mergedConfig";

import { copy, resolveCopyEntries } from "./copy";

export async function getMatchedCopyEntry(filepath: string) {
  const resolvedCopyEntryList = await resolveCopyEntries(WeappDevContext.config);
  const innerCopyEntryList = await resolveCopyEntries({ copy: getInnerCopyEntry() });

  const matchedCopy = [...resolvedCopyEntryList, ...innerCopyEntryList].find(
    (item) => item.from === filepath,
  );
  return matchedCopy ? { ...matchedCopy, to: WeappDevContext.config.outDir } : null;
}

/**
 * 获取内部 copy entry
 * @returns
 */
export function getInnerCopyEntry() {
  const { srcRoot, outDir, cdn } = WeappDevContext.config;

  const entries = [
    {
      from: [`${srcRoot}/**/*.{wxs,js}`, `${srcRoot}/*.json`],
      to: `${outDir}`,
      flatten: false,
    },
  ];

  // 当 CDN 未生效时，自动复制 cdn.dirs 下的资源到 dist
  // 规则：只要 dev.enabled 或 url 任一启用，路径会被替换为远程地址，无需本地文件
  if (cdn?.dirs) {
    const shouldCopy = !(cdn.dev?.enabled || cdn.url);
    if (shouldCopy) {
      for (const dir of cdn.dirs) {
        const normalizedDir = dir.replace(/^\/+/, "");
        entries.push({
          from: [`${srcRoot}/${normalizedDir}/**/*`],
          to: `${outDir}/${normalizedDir}`,
          flatten: false,
        });
      }
    }
  }

  return entries;
}

export async function copyAssets() {
  return copy({
    copy: getInnerCopyEntry(),
  });
}
