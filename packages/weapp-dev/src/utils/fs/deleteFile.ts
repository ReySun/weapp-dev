import { statSync } from "node:fs";
import { unlink } from "node:fs/promises";

export function deleteFile(path: string) {
  const stat = statSync(path);
  if (!stat || !stat.isFile()) return;
  return unlink(path);
}
