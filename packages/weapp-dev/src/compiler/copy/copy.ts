// https://github.com/rolldown/tsdown/blob/main/src/features/copy.ts
// MIT License
import path from "node:path";

import { glob, isDynamicPattern } from "tinyglobby";

import { WeappDevConfig } from "@/config/weappDevConfig";
import { Awaitable } from "@/types/utils";
import { toArray } from "@/utils/array/toArray";
import { fsCopy } from "@/utils/fs/fs";
import { copyLogger } from "@/utils/logger";

export interface CopyEntry {
  /**
   * Source path or glob pattern.
   */
  from: string | string[];
  /**
   * Destination path.
   * If not specified, defaults to the output directory ("outDir").
   */
  to?: string;
  /**
   * Whether to flatten the copied files (not preserving directory structure).
   *
   * @default true
   */
  flatten?: boolean;
  /**
   * Output copied items to console.
   * @default false
   */
  verbose?: boolean;
  /**
   * Change destination file or folder name.
   */
  rename?: string | ((name: string, extension: string, fullPath: string) => string);
}
export type CopyOptions = Array<string | CopyEntry>;
export type CopyOptionsFn = (options: WeappDevConfig) => Awaitable<CopyOptions>;

type ResolvedCopyEntry = CopyEntry & { from: string; to: string };

export async function copy(options: WeappDevConfig): Promise<void> {
  if (!options.cwd) {
    options.cwd = process.cwd();
  }
  if (!options.copy) return;

  const resolved = await resolveCopyEntries(options);
  await Promise.all(
    resolved.map(({ from, to, verbose }) => {
      if (verbose) {
        copyLogger.info(
          `Copying files from ${path.relative(options.cwd, from)} to ${path.relative(
            options.cwd,
            to,
          )}`,
        );
      }
      return fsCopy(from, to);
    }),
  );
}

export async function resolveCopyEntries(options: WeappDevConfig): Promise<ResolvedCopyEntry[]> {
  if (!options.cwd) {
    options.cwd = process.cwd();
  }

  const copy = toArray(
    typeof options.copy === "function" ? await options.copy(options) : options.copy,
  );
  if (!copy.length) return [];

  const resolved = (
    await Promise.all(
      copy.map(async (entry) => {
        if (typeof entry === "string") {
          entry = { from: [entry] };
        }
        let from = toArray(entry.from);

        const isGlob = from.some((f) => isDynamicPattern(f));
        if (isGlob) {
          from = await glob(from, {
            cwd: options.cwd,
            onlyFiles: true,
            expandDirectories: false,
          });
        }

        return from.map((file) =>
          resolveCopyEntry({ ...entry, from: file }, options.cwd, options.outDir),
        );
      }),
    )
  ).flat();

  if (!resolved.length) {
    // copyLogger.warn(`No files matched for copying.`);
  }

  return resolved;
}

// https://github.com/vladshcherbin/rollup-plugin-copy/blob/master/src/index.js
// MIT License
export function resolveCopyEntry(
  entry: CopyEntry & { from: string },
  cwd: string,
  outDir: string,
): CopyEntry & { from: string; to: string } {
  const { flatten = true, rename } = entry;
  const from = path.resolve(cwd, entry.from);
  const to = entry.to ? path.resolve(cwd, entry.to) : outDir;

  const { base, dir } = path.parse(path.relative(cwd, from));
  const destFolder = flatten || (!flatten && !dir) ? to : dir.replace(dir.split(path.sep)[0], to);
  const dest = path.join(destFolder, rename ? renameTarget(base, rename, from) : base);

  return { ...entry, from, to: dest };
}

function renameTarget(target: string, rename: NonNullable<CopyEntry["rename"]>, src: string) {
  const parsedPath = path.parse(target);

  return typeof rename === "string"
    ? rename
    : rename(parsedPath.name, parsedPath.ext.replace(".", ""), src);
}
