import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { WeappDevContext } from "@/config/mergedConfig";

function hasTailwindConfig(cwd: string): boolean {
  return (
    existsSync(join(cwd, "tailwind.config.js")) ||
    existsSync(join(cwd, "tailwind.config.ts")) ||
    existsSync(join(cwd, "tailwind.config.mjs")) ||
    existsSync(join(cwd, "tailwind.config.cjs"))
  );
}

function hasTailwindDependency(cwd: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});
    return deps.includes("tailwindcss") || devDeps.includes("tailwindcss");
  } catch {
    return false;
  }
}

export function isTailwindcssEnabled(): boolean {
  const { weappTwConfig, cwd } = WeappDevContext.config;
  if (weappTwConfig.enable === false) return false;
  return hasTailwindConfig(cwd) || hasTailwindDependency(cwd);
}
