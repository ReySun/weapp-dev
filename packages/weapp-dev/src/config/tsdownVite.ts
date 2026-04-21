// oxlint-disable-next-line no-unused-vars
import type { UserConfig as TsdownUserConfig } from "tsdown";
import type { UserConfig as ViteUserConfig } from "vite";

export interface TsdownViteUserConfig {
  /**
   * Compile-time env variables, which can be accessed via `import.meta.env` or `process.env`.
   * @example
   * ```json
   * {
   *   "DEBUG": true,
   *   "NODE_ENV": "production"
   * }
   * ```
   */
  env?: Record<string, any>;

  /**
   * Path to env file providing compile-time env variables.
   * @example
   * `.env`, `.env.production`, etc.
   */
  envFile?: string;

  /**
   * Env variables starts with `envPrefix` will be exposed to your client source code via import.meta.env.
   * @default ['VITE_', 'TSDOWN_]
   */
  envPrefix?: string | string[];
  /**
   * Define global variable replacements.
   * Entries will be defined on `window` during dev and replaced during build.
   */
  define?: Record<string, any>;
  // resolve?: {
  //   alias?: TsdownUserConfig["alias"];
  // };
  plugins?: ViteUserConfig["plugins"];
}
