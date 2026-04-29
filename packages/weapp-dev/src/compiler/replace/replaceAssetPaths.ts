export type AssetReplaceFileType = "wxml" | "wxss" | "js";

export interface ReplaceAssetPathsOptions {
  content: string;
  fileType: AssetReplaceFileType;
  dirs: string[];
  prefix: string;
}

/**
 * 将内容中匹配 dirs 的绝对路径替换为带前缀的路径
 * @param dirs 资源目录列表，如 ['/assets', '/static']
 */
export function replaceAssetPaths(options: ReplaceAssetPathsOptions): string {
  const { content, fileType, dirs, prefix } = options;
  const normalizedPrefix = prefix.replace(/\/?$/, "/");

  const isMatch = (path: string) => {
    return dirs.some((dir) => path.startsWith(dir + "/"));
  };

  let result = content;

  if (fileType === "wxml") {
    // src="/..." 或 src='/...'
    result = result.replace(/(\ssrc=["'])(\/[^"']+)(["'])/g, (match, pre, path, post) => {
      if (isMatch(path)) {
        return pre + normalizedPrefix + path.slice(1) + post;
      }
      return match;
    });

    // style="...url(/...)..."
    result = result.replace(/(\sstyle=["'][^"']*url\()([^)]+)(\))/g, (match, pre, path, post) => {
      const trimmed = path.replace(/["']/g, "");
      if (trimmed.startsWith("/") && isMatch(trimmed)) {
        return pre + normalizedPrefix + trimmed.slice(1) + post;
      }
      return match;
    });
  } else if (fileType === "wxss") {
    // url(/...) 或 url("/...") 或 url('/...')
    result = result.replace(/(url\(["']?)(\/[^"')]+)(["']?\))/g, (match, pre, path, post) => {
      if (isMatch(path)) {
        return pre + normalizedPrefix + path.slice(1) + post;
      }
      return match;
    });
  } else {
    // JS: 字符串字面量中的绝对路径
    result = result.replace(/([`'"])(\/[^`'"]+)\1/g, (match, quote, path) => {
      if (isMatch(path)) {
        return quote + normalizedPrefix + path.slice(1) + quote;
      }
      return match;
    });
  }

  return result;
}
