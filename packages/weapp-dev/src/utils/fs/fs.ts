import type { Stats } from "node:fs";
// https://github.com/rolldown/tsdown/blob/main/src/utils/fs.ts
// MIT License
import { access, cp, rm, stat } from "node:fs/promises";

export async function fsExists(path: string): Promise<boolean> {
  return await access(path).then(
    () => true,
    () => false,
  );
}

export async function fsStat(path: string): Promise<Stats | null> {
  return await stat(path).catch(() => null);
}

export async function fsRemove(path: string): Promise<void> {
  return await rm(path, { force: true, recursive: true }).catch(() => {});
}

export async function fsCopy(from: string, to: string): Promise<void> {
  return await cp(from, to, { recursive: true, force: true });
}
