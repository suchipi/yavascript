interface StringConstructor {
  // From https://www.npmjs.com/package/string-dedent
  dedent(str: string): string;
  dedent(str: TemplateStringsArray, ...substitutions: unknown[]): string;
  dedent<A extends unknown[], R, T>(
    tag: (this: T, strings: TemplateStringsArray, ...substitutions: A) => R
  ): (this: T, strings: TemplateStringsArray, ...substitutions: A) => R;
}
