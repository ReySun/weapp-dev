import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    // typeAware: true,
  },
  ignorePatterns: ["examples/**"],
  rules: {
    "no-useless-catch": "off",
    "no-useless-empty-export": "off",
  },
});
