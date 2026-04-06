import fs from "node:fs";
import { dirname } from "node:path";

export function ensureFile(filePath: string, defaultContent = "") {
  const dir = dirname(filePath);

  // 1️⃣ 确保目录存在
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 2️⃣ 确保文件存在
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf-8");
  }
}
