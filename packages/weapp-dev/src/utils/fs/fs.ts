// https://github.com/rolldown/tsdown/blob/main/src/utils/fs.ts
// MIT License
import { access, cp, rm, stat } from "node:fs/promises";
import type { Stats } from "node:fs";

export function fsExists(path: string): Promise<boolean> {
  return access(path).then(
    () => true,
    () => false,
  );
}

export function fsStat(path: string): Promise<Stats | null> {
  return stat(path).catch(() => null);
}

export function fsRemove(path: string): Promise<void> {
  return rm(path, { force: true, recursive: true }).catch(() => {});
}

export function fsCopy(from: string, to: string): Promise<void> {
  return cp(from, to, { recursive: true, force: true });
}
