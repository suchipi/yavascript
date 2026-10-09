/**
 * The `yavascript` global contains metadata about the currently-running
 * yavascript binary, as well as access to yavascript's compilers for
 * compile-to-js languages.
 *
 * **Example**
 * ```ts
 * console.log(yavascript.version, yavascript.arch, yavascript.ecmaVersion);
 * ```
 */
declare const yavascript: {
  /**
   * The version of the currently-running yavascript binary.
   *
   * Will be something formatted like one of these:
   * - "v0.0.7"
   * - "v0.1.3-alpha"
   * - "git-286a3a336849"
   * - "git-286a3a336849-dirty"
   *
   * Or, more formally: either a "V" version string or a "GIT" version string:
   * - "V" version strings start with the character 'v', followed by a semver
   *   version string, optionally followed by the character '-' and any
   *   arbitrary content afterwards.
   * - "GIT" version strings start with the prefix "git-", followed by the
   *   first 12 digits of a git commit SHA, optionally followed by the
   *   character '-' and any arbitrary content afterwards.
   *
   * **Example**
   * ```ts
   * if (yavascript.version.startsWith("git-")) {
   *   console.warn("Running a development build of yavascript");
   * }
   * ```
   */
  version: string;

  /**
   * The processor architecture of the currently-running `yavascript` binary.
   *
   * **Example**
   * ```ts
   * const downloadName = `my-tool-${yavascript.arch}.tar.gz`;
   * console.log(downloadName);
   * ```
   */
  arch: "x86_64" | "arm64";

  /**
   * The version of the ecma262 standard supported by the currently-running
   * yavascript binary.
   *
   * Possible values (depending on yavascript version): "ES2020", "ES2023".
   *
   * **Example**
   * ```ts
   * console.log(`This yavascript supports ${yavascript.ecmaVersion} syntax`);
   * ```
   */
  ecmaVersion: string;

  /**
   * The compilers yavascript uses internally to load files.
   *
   * Each function returns a JavaScript source code string.
   *
   * **Example**
   * ```ts
   * const { ts, coffee } = yavascript.compilers;
   * console.log(ts("const x: number = 1;"));
   * console.log(coffee("x = 1"));
   * ```
   */
  compilers: {
    /**
     * The function yavascript uses internally to load JavaScript files.
     *
     * You might think this would be a no-op, but we do some CommonJS/ECMAScript
     * Module interop transformations here.
     *
     * **Example**
     * ```ts
     * const output = yavascript.compilers.js("export const x = 1;", {
     *   filename: "x.js",
     * });
     * console.log(output);
     * ```
     */
    js(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load [TypeScript JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript JSX syntax. yavascript doesn't do typechecking of TypeScript syntax.
     *
     * **Example**
     * ```ts
     * const tsx = "const link = <a href={url as string} />;";
     * console.log(yavascript.compilers.tsx(tsx));
     * ```
     */
    tsx(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load [TypeScript](https://www.typescriptlang.org/) files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load TypeScript syntax. yavascript doesn't do typechecking of TypeScript syntax.
     *
     * **Example**
     * ```ts
     * const output = yavascript.compilers.ts("const x: number = 1;", {
     *   filename: "x.ts",
     * });
     * console.log(output);
     * ```
     */
    ts(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load JSX files.
     *
     * yavascript uses [Sucrase 3.35.0](https://sucrase.io/) to load JSX syntax.
     *
     * See {@link JSX} for info about configuring JSX pragma, swapping out the
     * default `createElement` implementation, etc.
     *
     * **Example**
     * ```ts
     * const jsx = 'const link = <a href="https://example.com" />;';
     * console.log(yavascript.compilers.jsx(jsx));
     * ```
     */
    jsx(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load [CoffeeScript](https://coffeescript.org/) files.
     *
     * yavascript embeds CoffeeScript 2.7.0.
     *
     * **Example**
     * ```ts
     * console.log(yavascript.compilers.coffee("square = (x) -> x * x"));
     * ```
     */
    coffee(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load [Civet](https://civet.dev/) files.
     *
     * yavascript embeds Civet 0.9.0.
     *
     * **Example**
     * ```ts
     * const civet = "square := (x: number) => x * x";
     * console.log(yavascript.compilers.civet(civet));
     * ```
     */
    civet(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;

    /**
     * The function yavascript uses internally to load files which don't have an
     * extension.
     *
     * It tries to parse the file as each of the following languages, in order,
     * until it finds one which doesn't have a syntax error:
     *
     * - JSX
     * - TSX
     * - Civet
     * - CoffeeScript
     *
     * If none of the languages work, the file's original content gets used so
     * that a syntax error can be reported to the user.
     *
     * **Example**
     * ```ts
     * const output = yavascript.compilers.autodetect("square = (x) -> x * x");
     * console.log(output);
     * ```
     */
    autodetect(
      code: string,
      options?: { filename?: string | Path; expression?: boolean },
    ): string;
  };

  /**
   * Returns the .d.ts types for all the APIs in this version of yavascript as a
   * string.
   *
   * It's the same string that gets logged when you run yavascript with the
   * `--print-types` command-line flag.
   *
   * **Example**
   * ```ts
   * writeFile("yavascript.d.ts", yavascript.getTypesDts());
   * ```
   */
  getTypesDts(): string;
};
