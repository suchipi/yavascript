interface StringConstructor {
  /**
   * The function `String.dedent` can be used to remove leading indentation from
   * a string. It is commonly used as a tagged template function, but you can
   * also call it and pass in a string.
   *
   * Note that the first line of the string must be empty.
   *
   * `String.dedent` is the default export from the npm package `string-dedent`.
   * See its readme on npm for more info:
   * https://www.npmjs.com/package/string-dedent
   */
  dedent: {
    /**
     * Removes leading minimum indentation from the string `input`.
     * The first line of `input` MUST be empty.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
     */
    (input: string): string;

    /**
     * Removes leading minimum indentation from the tagged template literal.
     * The first line of the template literal MUST be empty.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
     */
    (
      strings: readonly string[] | ArrayLike<string>,
      ...substitutions: unknown[]
    ): string;

    /**
     * Wrap another template tag function such that tagged literals
     * become dedented before being passed to the wrapped function.
     *
     * For more info, see: https://www.npmjs.com/package/string-dedent#usage
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
