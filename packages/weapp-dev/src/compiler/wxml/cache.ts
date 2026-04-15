import { md5 } from "@/utils/md5";
import { extractWxmlTwClasses } from "./extractWxmlTwClasses";
import { isEqualSet } from "@/utils/set/isEqualSet";
import { diffSetString } from "@/utils/set/diffSetString";

interface IWxmlCache {
  fileMd5: string;
  classList: Set<string>;
}
type FilePath = string;

export const wxmlCache = new Map<FilePath, IWxmlCache>();

/**
 * 设置 WXML 文件的编存
 * @param file
 * @param content
 */
export function setWxmlCache(file: FilePath, content: string) {
  const classList = extractWxmlTwClasses(content);

  wxmlCache.set(file, {
    fileMd5: md5(content),
    classList,
  });
}

/**
 * 获取 WXML 文件的编存Md5
 * @param file
 */
export function getWxmlFileCachedMd5(file: FilePath) {
  const cache: IWxmlCache | undefined = wxmlCache.get(file);
  return cache?.fileMd5;
}

/**
 * 判断 WXML 文件是否变更
 * @param file
 * @param content
 * @returns
 */
export function isWxmlFileChanged(file: FilePath, content: string) {
  const beforeMd5 = getWxmlFileCachedMd5(file);
  const afterMd5 = md5(content);
  return beforeMd5 !== afterMd5;
}

/**
 * 获取 WXML 文件的编存class
 * @param file
 */
export function getWxmlFileCachedClassList(file: FilePath) {
  const cache: IWxmlCache | undefined = wxmlCache.get(file);
  return cache?.classList;
}

/**
 * 判断 WXML 文件的class是否变更过
 * @param file
 * @param content
 * @returns
 */
export function wxmlFileClassChangedInfo(file: FilePath, content: string) {
  const beforeClassList = getWxmlFileCachedClassList(file);
  const afterClassList = extractWxmlTwClasses(content);
  console.log("beforeClassList", beforeClassList);
  console.log("afterClassList", afterClassList);
  console.log("addedClass", diffSetString(afterClassList, beforeClassList));
  return {
    isChanged: !isEqualSet(beforeClassList, afterClassList),
    classList: afterClassList,
    addedClass: diffSetString(afterClassList, beforeClassList),
  };
}
