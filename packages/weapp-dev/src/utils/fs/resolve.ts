import { resolve as nodeResolve } from "node:path";

import { WeappDevContext } from "../context/initContext";

export function resolve(...args: Parameters<typeof nodeResolve>) {
  const { cwd } = WeappDevContext.config;

  return nodeResolve(cwd, ...args);
}
