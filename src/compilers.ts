import { memoize } from "./lazy-load";

const getSucrase: () => typeof import("sucrase") = memoize(
  () => require("sucrase") as any
);
const getCoffeeScript: () => typeof import("coffeescript") = memoize(
  () => require("coffeescript") as any
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
    // TODO: sucrase doesn't have transform expression; would need to
    // do parseExpression + transformAst + generate + get node from body's
    // first expression statement.
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
    return code;
  },

  tsx(code: string, options?: CompilerOptions): string {
    return compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript", "jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
  },

  ts(code: string, options?: CompilerOptions): string {
    return compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["typescript"],
    });
  },

  jsx(code: string, options?: CompilerOptions): string {
    return compileUsingSucrase(stripShebangs(code), options, {
      transforms: ["jsx"],
      // We read this from the global because the user is allowed to
      // change JSX.pragma to change this.
      jsxPragma: globalThis.JSX.pragma,
      // We read this from the global because the user is allowed to
      // change JSX.pragmaFrag to change this.
      jsxFragmentPragma: globalThis.JSX.pragmaFrag,
    });
  },

  coffee(code: string, options?: CompilerOptions): string {
    const compiled = getCoffeeScript().compile(stripShebangs(code), {
      bare: true,
      filename: options?.filename,
    });
    return compiled;
  },
};

export default compilers;
