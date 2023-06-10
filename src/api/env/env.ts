import * as std from "quickjs:std";

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
