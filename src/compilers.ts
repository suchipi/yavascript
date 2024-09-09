import { memoize } from "./lazy-load";
import * as CJS from "./cjs-interop";
import * as npmProto from "./module-protocols/npm";

const getSucrase: () => typeof import("sucrase") = memoize(() =>
  require("sucrase")
);
const getCoffeeScript: () => typeof import("coffeescript") = memoize(() =>
  require("coffeescript")
);
const getCivet: () => typeof import("@danielx/civet") = memoize(() =>
  require("@danielx/civet")
);

export type CompilerOptions = {
  filename?: string;
  expression?: boolean;
};

function stripShebangs(input: string) {
  let shebangs = 0;
  const lines = input.split(/\r\n|\r|\n/g);

  while (lines[0] != null && lines[0].startsWith("#!")) {
    shebangs += 1;
    lines.shift();
  }

  const newBlankLines = Array(shebangs).fill("");
  return newBlankLines.concat(lines).join("\n");
}

function compileUsingSucrase(
  code: string,
  options: CompilerOptions | undefined | null,
  sucraseOptions: import("sucrase").Options
) {
  if (options?.filename) {
    sucraseOptions.filePath = options.filename;
  }

  // All this does is make jsx elements not have __self and __fileName,
  // which imho is better for yavascript itself since __self will often
  // be the global, which makes logging JSX elements really obnoxious
  sucraseOptions.production = true;

  if (options?.expression) {
    // NOTE: sucrase doesn't have transform expression, and it doesn't have
    // a babel-like AST representation internally that we could use to
    // more-nicely transform an expression. Best we can do without forking it
    // is wrap in parens to force "expression mode" and let it error
    // accordingly if the thing was only valid syntax in a statement position.
    const result = getSucrase().transform("(" + code + ")", sucraseOptions);
    const withoutTrailingSemi = result.code.replace(/;$/, "");
    if (
      withoutTrailingSemi[0] === "(" &&
      withoutTrailingSemi[withoutTrailingSemi.length - 1] === ")"
    ) {
      // unwrap parens we added
      return withoutTrailingSemi.slice(1, -1);
    } else {
      return withoutTrailingSemi;
    }
  } else {
    const result = getSucrase().transform(code, sucraseOptions);
    return result.code;
  }
}

const compilers = {
  js(code: string, options?: CompilerOptions): string {
    if (
      options?.expression ||
      (options?.filename && npmProto.handlesModulePath(options.filename)) ||
      !CJS.looksLikeCommonJS(code)
    ) {
      return code;
    }

    return CJS.wrapCommonJSCode(code);
  },

  tsx(code: string, options?: CompilerOptions): string {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript", "jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
    return compilers.js(compiled, options);
  },

  ts(code: string, options?: CompilerOptions): string {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript"],
    });
    return compilers.js(compiled, options);
  },

  jsx(code: string, options?: CompilerOptions): string {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
    return compilers.js(compiled, options);
  },

  coffee(code: string, options?: CompilerOptions): string {
    const compiled = getCoffeeScript().compile(stripShebangs(code), {
      bare: true,
      filename: options?.filename,
    });
    return compilers.js(compiled, options);
  },

  civet(code: string, options?: CompilerOptions): string {
    const compiled = getCivet().compile(code, {
      js: true,
      filename: options?.filename,
      sync: true,
    });
    return compilers.jsx(compiled, options);
  },

  autodetect(code: string, options?: CompilerOptions): string {
    try {
      return compilers.jsx(code, options);
    } catch {
      try {
        return compilers.tsx(code, options);
      } catch {
        try {
          return compilers.civet(code, options);
        } catch {
          try {
            return compilers.coffee(code, options);
          } catch {
            return code;
          }
        }
      }
    }
  },

  esmToCjs(code: string, options?: CompilerOptions): string {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["imports"],
      preserveDynamicImport: true,
    });
    return compilers.js(compiled, options);
  },
};

export default compilers;
