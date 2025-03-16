/**
 * Splits the string passed into it on `\n` and then returns the lines matching
 * the specified pattern, as an array of strings or detail objects.
 *
 * @param str - The string to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepFile} and {@link String.prototype.grep}.
 */
declare const grepString: {
  (
    str: string,
    pattern: string | RegExp,
    options: GrepOptions & { details: true }
  ): Array<GrepMatchDetail>;

  (str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
};

/**
 * Reads the file content at `path`, splits it on `\n`, and then returns the
 * lines matching the specified pattern, as an array of strings or detail objects.
 *
 * @param str - The string to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepString} and {@link String.prototype.grep}.
 */
declare const grepFile: {
  (
    path: string | Path,
    pattern: string | RegExp,
    options: GrepOptions & { details: true }
  ): Array<GrepMatchDetail>;

  (
    path: string | Path,
    pattern: string | RegExp,
    options?: GrepOptions
  ): Array<string>;
};

interface String {
  // Same as grepString but without the first argument.
  /**
   * Splits the target string on `\n` and then returns the lines matching the
   * specified pattern, as an array of strings or detail objects.
   *
   * @param str - The string to search through.
   * @param pattern - The pattern to find. Can be a string or a RegExp.
   * @param options - Options which control matching behavior.
   *
   * See also {@link grepString} and {@link grepFile}.
   */
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & { details: true }
    ): Array<GrepMatchDetail>;

    (pattern: string | RegExp, options?: GrepOptions): Array<string>;
  };
}

declare interface GrepOptions {
  /**
   * When `inverse` is true, the grep function returns those lines which DON'T
   * match the pattern, instead of those which do. Defaults to `false`.
   */
  inverse?: boolean;

  /**
   * When `details` is true, the grep function returns an array of
   * {@link GrepMatchDetail} objects instead of an array of strings. Defaults to
   * `false`.
   */
  details?: boolean;
}

/**
 * When `grepString`, `grepFile`, or `String.prototype.grep` are called with the
 * `{ details: true }` option set, an Array of `GrepMatchDetail` objects is
 * returned.
 */
declare interface GrepMatchDetail {
  lineNumber: number;
  lineContent: string;
  matches: RegExpMatchArray;
}
