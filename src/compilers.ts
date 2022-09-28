import * as Babel from "@babel/standalone";
import * as CoffeeScript from "coffeescript";

export type CompilerOptions = {
  filename?: string;
  expression?: boolean;
};

function compileUsingBabel(
  code: string,
  options: CompilerOptions | undefined | null,
  presets: any
) {
  const babelOptions = {
    presets,
    filename: options?.filename,
  };

  if (options?.expression) {
    // TODO: babel standalone doesn't have transform expression; would need to
    // do parseExpression + transformAst + generate + get node from body's
    // first expression statement.
    const result = Babel.transform("(" + code + ")", babelOptions);
    return result.code.replace(/;$/, "");
  } else {
    const result = Babel.transform(code, babelOptions);
    return result.code;
  }
}

const compilers = {
  tsx(code: string, options?: CompilerOptions): string {
    const presets = [
      "typescript",
      [
        "react",
        {
          // We read this from the global because the user is allowed to
          // change JSX.pragma to change this.
          pragma: globalThis.JSX.pragma,
          // We read this from the global because the user is allowed to
          // change JSX.pragmaFrag to change this.
          pragmaFrag: globalThis.JSX.pragmaFrag,
        },
      ],
    ];

    return compileUsingBabel(code, options, presets);
  },

  ts(code: string, options?: CompilerOptions): string {
    const presets = ["typescript"];

    return compileUsingBabel(code, options, presets);
  },

  jsx(code: string, options?: CompilerOptions): string {
    const presets = [
      [
        "react",
        {
          // We read this from the global because the user is allowed to
          // change JSX.pragma to change this.
          pragma: globalThis.JSX.pragma,
          // We read this from the global because the user is allowed to
          // change JSX.pragmaFrag to change this.
          pragmaFrag: globalThis.JSX.pragmaFrag,
        },
      ],
    ];

    return compileUsingBabel(code, options, presets);
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
