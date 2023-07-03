import * as std from "quickjs:std";
import { makeErrorWithProperties } from "./error-with-properties";

const hasOwn = Object.hasOwn;

export function patchRequire(theGlobal: typeof globalThis) {
  const nativeRequire = theGlobal.require;

  const newRequire = (path: string) => {
    const callerFile = std.getFileNameFromStack(1);
    let resolved: string;
    try {
      resolved = std.resolveModule(path, callerFile);
    } catch (err) {
      throw makeErrorWithProperties(`Cannot find module`, {
        request: path,
        fromFile: callerFile,
      });
    }

    const mod = nativeRequire(resolved);
    if (
      hasOwn(mod, "__isCjsModule") &&
      mod.__isCjsModule === true &&
      hasOwn(mod, "__cjsExports")
    ) {
      const exportedNames = Object.keys(mod);
      if (
        // if the only exports are the previously-checked __isCjsModule and __cjsExports...
        exportedNames.length === 2 ||
        // or those two plus 'default'
        (exportedNames.length === 3 && hasOwn(mod, "default"))
      ) {
        // respect its cjs exports
        return mod.__cjsExports;
      }

      // if they mixed ESM and CJS for anything other than 'default',
      // treat it like ESM.
    }

    return mod;
  };

  theGlobal.require = Object.assign(newRequire, nativeRequire);

  Object.defineProperty(newRequire, "name", {
    value: "require",
    configurable: true,
  });
}

const CJS_RE = /exports\.\w|module\.exports/;
export function looksLikeCommonJS(code: string): boolean {
  return CJS_RE.test(code);
}

const cjsPreamble = `
let __isCjsModule = false;
const exports = new Proxy({}, {
  set(obj, prop, value) {
    __isCjsModule = true;
    return Reflect.set(obj, prop, value);
  }
});
const module = new Proxy({
  exports,
  id: __filename
}, {
  set(obj, prop, value) {
    if (prop === "exports") {
      __isCjsModule = true;
    }
    return Reflect.set(obj, prop, value);
  }
});
`
  .trim()
  .replace(/\n/g, " ");

const cjsPostamble = `
export { __isCjsModule };
export const __cjsExports = module.exports;
`
  .trim()
  .replace(/\n/g, " ");

export function wrapCommonJSCode(code: string): string {
  return `${cjsPreamble} ${code}\n${cjsPostamble}`;
}
