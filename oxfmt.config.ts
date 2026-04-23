import { defineConfig } from "oxfmt";

import { ignorePatterns } from "./oxlint.config.ts";

export default defineConfig({
  sortImports: true,
  sortTailwindcss: true,
  ignorePatterns: [...ignorePatterns],
});
