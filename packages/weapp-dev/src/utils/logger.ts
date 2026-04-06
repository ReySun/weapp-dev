// logger.ts
import consola from "consola";

type LogScope = string;

function createLogger(scope: LogScope) {
  const prefix = `[${scope}]`;

  return {
    info(msg: string) {
      consola.info(`${prefix} ${msg}`);
    },

    success(msg: string) {
      consola.success(`${prefix} ✔ ${msg}`);
    },

    error(msg: string, err?: any) {
      consola.error(`${prefix} ✖ ${msg}`);
      if (err) {
        consola.error(err);
      }
    },

    warn(msg: string) {
      consola.warn(`${prefix}⚠️ ${msg}`);
    },
  };
}

export const wxssLogger = createLogger("WXSS");
export const wxmlLogger = createLogger("WXML");
export const tsLogger = createLogger("TS");
export const copyLogger = createLogger("COPY");
