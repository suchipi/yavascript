import { memoizeFn } from "./lazy-load";
import * as CJS from "./cjs-interop";
import * as npmProto from "./module-protocols/npm";
import { Path } from "./api/path";
import { registerSourceMappers, Mapper } from "./source-maps";
import { logger } from "./api/logger";
import type { EncodedSourceMap } from "@jridgewell/trace-mapping";

const getSucrase: () => typeof import("sucrase") = memoizeFn(() =>
  require("sucrase"),
);
const getCoffeeScript: () => typeof import("coffeescript") = memoizeFn(() =>
  require("coffeescript"),
);
const getCivet: () => typeof import("@danielx/civet") = memoizeFn(() =>
  require("@danielx/civet"),
);

// `mappers` is ordered outermost-generated -> innermost-source
type CompileInternalResult = {
  code: string;
  mappers: Array<Mapper>;
};

export type CompilerOptions = {
  filename?: string | Path;
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
  sucraseOptions: import("sucrase").Options,
): { code: string; sourceMap?: EncodedSourceMap | undefined } {
  const filename = options?.filename?.toString();
  if (filename) {
    sucraseOptions.filePath = filename;
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
      return { code: withoutTrailingSemi.slice(1, -1) };
    } else {
      return { code: withoutTrailingSemi };
    }
  } else {
    if (filename) {
      sucraseOptions.sourceMapOptions = { compiledFilename: filename };
    }
    const result = getSucrase().transform(code, sucraseOptions);
    if (result.sourceMap != null) {
      return {
        code: result.code,
        sourceMap: result.sourceMap as EncodedSourceMap,
      };
    } else {
      return { code: result.code, sourceMap: undefined };
    }
  }
}

// These don't register their mappers, so they can compose (eg. civet -> jsx ->
// js) without clobbering each other.
const compilersInternal = {
  js(code: string, options?: CompilerOptions): CompileInternalResult {
    if (
      options?.expression ||
      (options?.filename &&
        npmProto.handlesModulePath(options.filename.toString())) ||
      !CJS.looksLikeCommonJS(code)
    ) {
      return { code, mappers: [] };
    }

    const wrapped = CJS.wrapCommonJSCode(code);
    return { code: wrapped.code, mappers: [wrapped.mapper] };
  },

  tsx(code: string, options?: CompilerOptions): CompileInternalResult {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript", "jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
    const jsResult = compilersInternal.js(compiled.code, options);
    return {
      code: jsResult.code,
      mappers: [
        ...jsResult.mappers,
        ...(compiled.sourceMap ? [compiled.sourceMap] : []),
      ],
    };
  },

  ts(code: string, options?: CompilerOptions): CompileInternalResult {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript"],
    });
    const jsResult = compilersInternal.js(compiled.code, options);
    return {
      code: jsResult.code,
      mappers: [
        ...jsResult.mappers,
        ...(compiled.sourceMap ? [compiled.sourceMap] : []),
      ],
    };
  },

  jsx(code: string, options?: CompilerOptions): CompileInternalResult {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
    const jsResult = compilersInternal.js(compiled.code, options);
    return {
      code: jsResult.code,
      mappers: [
        ...jsResult.mappers,
        ...(compiled.sourceMap ? [compiled.sourceMap] : []),
      ],
    };
  },

  coffee(code: string, options?: CompilerOptions): CompileInternalResult {
    const compiled = getCoffeeScript().compile(stripShebangs(code), {
      bare: true,
      filename: options?.filename?.toString(),
      sourceMap: true,
    });
    let coffeeScriptSourceMap: EncodedSourceMap | undefined;
    try {
      coffeeScriptSourceMap = JSON.parse(
        compiled.v3SourceMap,
      ) as EncodedSourceMap;
    } catch {
      logger.warn("Failed to parse CoffeeScript source map as JSON");
      logger.trace("Failed to parse CoffeeScript source map as JSON", {
        code,
        options,
        compiled,
      });
      coffeeScriptSourceMap = undefined;
    }
    const jsResult = compilersInternal.js(compiled.js, options);
    return {
      code: jsResult.code,
      mappers: [
        ...jsResult.mappers,
        ...(coffeeScriptSourceMap ? [coffeeScriptSourceMap] : []),
      ],
    };
  },

  civet(code: string, options?: CompilerOptions): CompileInternalResult {
    const filename = options?.filename?.toString();
    const compiled = getCivet().compile(code, {
      js: true,
      filename,
      sync: true,
      sourceMap: true,
    });
    const civetMap = compiled.sourceMap.json(
      filename ?? "",
    ) as EncodedSourceMap;

    const jsxResult = compilersInternal.jsx(compiled.code, options);
    return { code: jsxResult.code, mappers: [...jsxResult.mappers, civetMap] };
  },

  autodetect(code: string, options?: CompilerOptions): CompileInternalResult {
    try {
      return compilersInternal.jsx(code, options);
    } catch {
      try {
        return compilersInternal.tsx(code, options);
      } catch {
        try {
          return compilersInternal.civet(code, options);
        } catch {
          try {
            return compilersInternal.coffee(code, options);
          } catch {
            return { code, mappers: [] };
          }
        }
      }
    }
  },

  esmToCjs(code: string, options?: CompilerOptions): CompileInternalResult {
    const compiled = compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["imports"],
      preserveDynamicImport: true,
    });
    const jsResult = compilersInternal.js(compiled.code, options);
    return {
      code: jsResult.code,
      mappers: [
        ...jsResult.mappers,
        ...(compiled.sourceMap ? [compiled.sourceMap] : []),
      ],
    };
  },
};

function registerMappersIfFilenameInOptions(
  options: CompilerOptions | undefined | null,
  maps: Array<Mapper>,
): void {
  const filename = options?.filename?.toString();
  if (!filename || options?.expression || maps.length === 0) {
    return;
  }
  registerSourceMappers(filename, maps);
}

// The public surface (see langToCompiler): same as the internal compilers, but
// these register the assembled chain and return just the code string.
const compilers = {
  js(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.js(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  tsx(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.tsx(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  ts(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.ts(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  jsx(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.jsx(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  coffee(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.coffee(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  civet(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.civet(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  autodetect(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.autodetect(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },

  esmToCjs(code: string, options?: CompilerOptions): string {
    const result = compilersInternal.esmToCjs(code, options);
    registerMappersIfFilenameInOptions(options, result.mappers);
    return result.code;
  },
};

export default compilers;
