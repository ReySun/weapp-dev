import { InlineConfig } from "vite";
import { getPreserveModulesOutput } from "./rolldownOutput";

export function getDefaultViteConfig(input: string[]): InlineConfig {
  return {
    logLevel: "silent",

    build: {
      emptyOutDir: false,
      rolldownOptions: {
        input,
        output: getPreserveModulesOutput(),
      },
    },
    plugins: [],
  };
}
