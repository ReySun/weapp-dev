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
 * 获取内部copy entry
 * @returns
 */
export function getInnerCopyEntry() {
  const { srcRoot, outDir } = WeappDevContext.config;

  return [
    {
      from: `${srcRoot}/**/*.{json,js}`,
      to: `${outDir}`,
      flatten: false,
    },
  ];
}

export async function copyAssets() {
  return copy({
    copy: getInnerCopyEntry(),
  });
}
