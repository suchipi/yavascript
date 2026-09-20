import * as engine from "quickjs:engine";
import { makeErrorWithProperties } from "./error-with-properties";
import type { LineOffsetMapper } from "./source-maps";

const hasOwn = Object.hasOwn;

export function patchRequire(theGlobal: typeof globalThis) {
  const nativeRequire = theGlobal.require;

  const newRequire = (path: string) => {
    const callerFile = engine.getFileNameFromStack(1);
    let resolved: string;
    try {
      resolved = engine.resolveModule(path, callerFile);
    } catch (err) {
      throw makeErrorWithProperties(`Cannot find module`, {
        request: path,
        fromFile: callerFile,
      });
    }

    const exps = nativeRequire(resolved);
    if (
      hasOwn(exps, "__isCjsModule") &&
      exps.__isCjsModule === true &&
      hasOwn(exps, "__cjsExports")
    ) {
      const exportedNames = Object.keys(exps);
      if (
        // if the only exports are the previously-checked __isCjsModule and __cjsExports...
        exportedNames.length === 2 ||
        // or those two plus 'default'
        (exportedNames.length === 3 && hasOwn(exps, "default"))
      ) {
        // respect its cjs exports
        return exps.__cjsExports;
      }

      // if they mixed ESM and CJS for anything other than 'default',
      // treat it like ESM.
    }

    // skypack creates named exports like these
    if (hasOwn(exps, "__moduleExports")) {
      return exps.__moduleExports;
    }

    return exps;
  };

  theGlobal.require = Object.assign(newRequire, nativeRequire);

  Object.defineProperty(newRequire, "name", {
    value: "require",
    configurable: true,
  });
}

const CJS_RE = /exports\.\w|module\.exports|Object\.defineProperty\(exports/;

// Wrapping a file declares `exports` and `module` around it, which collides
// with a file that declares either itself.
const OWN_BINDING_RE =
  /(?:^|[;{}()\s])(?:const|let|var|function|class)\s+(?:exports|module)\b/;

// Comments and string literals are dropped first so that merely mentioning
// module.exports in prose doesn't make a file CommonJS. Regex literals aren't
// tracked, which at worst leaves a quote character in the scrubbed text.
function withoutCommentsAndStrings(code: string): string {
  let out = "";
  let index = 0;

  while (index < code.length) {
    const char = code[index];
    const next = code[index + 1];

    if (char === "/" && next === "/") {
      while (index < code.length && code[index] !== "\n") index++;
      continue;
    }

    if (char === "/" && next === "*") {
      index += 2;
      while (
        index < code.length &&
        !(code[index] === "*" && code[index + 1] === "/")
      ) {
        index++;
      }
      index += 2;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      index++;
      while (index < code.length) {
        if (code[index] === "\\") {
          index += 2;
          continue;
        }
        if (code[index] === char) {
          index++;
          break;
        }
        index++;
      }
      continue;
    }

    out += char;
    index++;
  }

  return out;
}

export function looksLikeCommonJS(code: string): boolean {
  const scrubbed = withoutCommentsAndStrings(code);
  if (OWN_BINDING_RE.test(scrubbed)) return false;
  return CJS_RE.test(scrubbed);
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

export function wrapCommonJSCode(code: string): {
  code: string;
  mapper: LineOffsetMapper;
} {
  return {
    code: `${cjsPreamble}\n${code}\n${cjsPostamble}`,
    mapper: { lineOffset: -1 },
  };
}
