import path from "path";

export function replaceSrcToDist(
  filePath: string,

  options?: {
    fromDir: string;
    toDir: string;
    mode?: "first" | "last" | "all";
  },
) {
  const { mode = "first", fromDir = "src", toDir = "dist" } = options || {};

  const normalized = path.normalize(filePath);
  const parts = normalized.split(path.sep);

  if (mode === "first") {
    const index = parts.indexOf(fromDir);
    if (index !== -1) parts[index] = toDir;
  }

  if (mode === "last") {
    const index = parts.lastIndexOf(fromDir);
    if (index !== -1) parts[index] = toDir;
  }

  if (mode === "all") {
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === fromDir) {
        parts[i] = toDir;
      }
    }
  }

  return parts.join(path.sep);
}
