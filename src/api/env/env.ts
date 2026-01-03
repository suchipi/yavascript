import * as std from "quickjs:std";
import { logger } from "../logger";

const _env = std.getenviron();

export const env = new Proxy(_env, {
  get(target, property, receiver) {
    if (typeof property === "symbol") return undefined;
    return std.getenv(property) || undefined;
  },

  set(target, property, value, receiver) {
    if (typeof property === "symbol") return false;

    if (value == null) {
      delete _env[property];
      std.unsetenv(property);
    } else {
      const strValue = String(value);
      _env[property] = strValue;
      std.setenv(property, strValue);
    }

    return true;
  },

  deleteProperty(target, property) {
    if (typeof property === "symbol") return false;

    std.unsetenv(property);
    delete _env[property];
    return true;
  },

  ownKeys(target) {
    return Object.keys(std.getenviron());
  },

  has(target, property) {
    if (typeof property === "symbol") return false;

    const result = std.getenv(property);
    return typeof result !== "undefined";
  },
});

export function readEnvBool<T>(
  key: string,
  fallback: T,
  logging: {
    warn?: (...args: Array<any>) => void;
  } = logger,
): boolean | T {
  const value = env[key];
  if (value == null) {
    return fallback;
  }

  switch (value) {
    case "true":
    case "True":
    case "TRUE":
    case "1": {
      return true;
    }

    case "false":
    case "False":
    case "FALSE":
    case "0": {
      return false;
    }

    default: {
      if (logging.warn) {
        logging.warn(
          `readEnvBool: environment variable ${JSON.stringify(
            key,
          )} was ${JSON.stringify(
            value,
          )}, which doesn't look like a boolean. Returning the fallback value of ${String(
            fallback,
          )}.`,
        );
      }
      return fallback;
    }
  }
}
