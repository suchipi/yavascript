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

  if (options?.expression) {
    // TODO: sucrase doesn't have transform expression; would need to
    // do parseExpression + transformAst + generate + get node from body's
    // first expression statement.
    const result = Sucrase.transform("(" + code + ")", sucraseOptions);
    return result.code.replace(/;$/, "");
  } else {
    const result = Sucrase.transform(code, sucraseOptions);
    return result.code;
  }
}

const compilers = {
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
