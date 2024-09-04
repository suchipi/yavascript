interface StringConstructor {
  /**
   * Remove leading minimum indentation from the string.
   * The first line of the string must be empty.
   *
   * https://github.com/tc39/proposal-string-dedent
   */
  dedent: {
    /**
     * Remove leading minimum indentation from the string.
     * The first line of the string must be empty.
     *
     * https://github.com/tc39/proposal-string-dedent
     */
    (input: string): string;

    /**
     * Remove leading minimum indentation from the template literal.
     * The first line of the string must be empty.
     *
     * https://github.com/tc39/proposal-string-dedent
     */
    (
      strings: readonly string[] | ArrayLike<string>,
      ...substitutions: unknown[]
    ): string;

    /**
     * Wrap another template tag function such that tagged literals
     * become dedented before being passed to the wrapped function.
     *
     * https://www.npmjs.com/package/string-dedent#usage
     */
    <
      Func extends (
        strings: readonly string[] | ArrayLike<string>,
        ...substitutions: any[]
      ) => string
    >(
      input: Func
    ): Func;
  };
}
