import { defineConfig } from "oxlint";

export const ignorePatterns = [
  "examples/**",
  ".trae",
  ".claude",
  ".agents",
  "packages/miniprogram-json-schema/**/*.json",
];

export default defineConfig({
  options: {
    // typeAware: true,
  },
  ignorePatterns,
  rules: {
    "no-useless-catch": "off",
    "no-useless-empty-export": "off",
  },
});
