import * as Sucrase from "sucrase";
import * as CoffeeScript from "coffeescript";

export type CompilerOptions = {
  filename?: string;
  expression?: boolean;
};

function compileUsingSucrase(
  code: string,
  options: CompilerOptions | undefined | null,
  sucraseOptions: Sucrase.Options
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
    const result = Sucrase.transform("(" + code + ")", sucraseOptions);
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
    const result = Sucrase.transform(code, sucraseOptions);
    return result.code;
  }
}

const compilers = {
  js(code: string, options?: CompilerOptions): string {
    return code;
  },

  tsx(code: string, options?: CompilerOptions): string {
    return compileUsingSucrase(code, options, {
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
    return compileUsingSucrase(code, options, {
      transforms: ["typescript"],
    });
  },

  jsx(code: string, options?: CompilerOptions): string {
    return compileUsingSucrase(code, options, {
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
    const compiled = CoffeeScript.compile(code, {
      bare: true,
      filename: options?.filename,
    });
    return compiled;
  },
};

export default compilers;
