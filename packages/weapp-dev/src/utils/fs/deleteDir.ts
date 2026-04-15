import { rmSync } from "node:fs";

export function deleteDir(dir: string) {
  rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
}
