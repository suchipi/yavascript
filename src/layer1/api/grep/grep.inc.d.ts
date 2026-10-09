/**
 * Splits the string passed into it on `\n` and then returns the lines matching
 * the specified pattern, as an array of strings or detail objects.
 *
 * @param str - The string to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepFile}, {@link grepArray}, {@link String.prototype.grep},
 * and {@link Array.prototype.grep}.
 *
 * **Example**
 * ```ts
 * const lines = grepString("apple\nbanana\ncherry", /an/);
 * console.log(lines); // ["banana"]
 * ```
 */
declare const grepString: {
  (
    str: string,
    pattern: string | RegExp,
    options: GrepOptions & { details: true },
  ): Array<GrepMatchDetail>;

  (str: string, pattern: string | RegExp, options?: GrepOptions): Array<string>;
};

/**
 * Returns those Array items matching the specified pattern, as either an
 * Array of items or an Array of detail objects.
 *
 * @param targetArray - The Array of strings to search through. Non-strings will be coerced to string during matching.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepString}, {@link grepFile}, {@link String.prototype.grep},
 * and {@link Array.prototype.grep}.
 *
 * **Example**
 * ```ts
 * const matches = grepArray(["apple", "banana", "cherry"], "an");
 * console.log(matches); // ["banana"]
 * ```
 */
declare const grepArray: {
  <T>(
    targetArray: Array<T>,
    pattern: string | RegExp,
    options: GrepOptions & { details: true },
  ): Array<GrepMatchDetail<T>>;

  <T>(
    targetArray: Array<T>,
    pattern: string | RegExp,
    options?: GrepOptions,
  ): Array<T>;
};

/**
 * Reads the file content at `path`, splits it on `\n`, and then returns the
 * lines matching the specified pattern, as an array of strings or detail
 * objects.
 *
 * @param path - The path to the file to search through.
 * @param pattern - The pattern to find. Can be a string or a RegExp.
 * @param options - Options which control matching behavior.
 *
 * See also {@link grepArray}, {@link grepString},
 * {@link String.prototype.grep}, and {@link Array.prototype.grep}.
 *
 * **Example**
 * ```ts
 * const todos = grepFile("README.md", /TODO/);
 * console.log(todos);
 * ```
 */
declare const grepFile: {
  (
    path: string | Path,
    pattern: string | RegExp,
    options: GrepOptions & { details: true },
  ): Array<GrepMatchDetail>;

  (
    path: string | Path,
    pattern: string | RegExp,
    options?: GrepOptions,
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
   * See also {@link grepString}, {@link grepArray}, {@link grepFile}, and
   * {@link Array.prototype.grep}.
   *
   * **Example**
   * ```ts
   * const lines = "apple\nbanana\ncherry".grep(/an/);
   * console.log(lines); // ["banana"]
   * ```
   */
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & { details: true },
    ): Array<GrepMatchDetail>;

    (pattern: string | RegExp, options?: GrepOptions): Array<string>;
  };
}

interface Array<T> {
  // Same as grepArray but without the first argument.
  /**
   * Returns those Array items matching the specified pattern, as either an
   * Array of items or an Array of detail objects.
   *
   * @param pattern - The pattern to find. Can be a string or a RegExp.
   * @param options - Options which control matching behavior.
   *
   * See also {@link grepString}, {@link grepArray}, {@link grepFile}, and
   * {@link String.prototype.grep}.
   *
   * **Example**
   * ```ts
   * const matches = ["apple", "banana", "cherry"].grep(/an/);
   * console.log(matches); // ["banana"]
   * ```
   */
  grep: {
    (
      pattern: string | RegExp,
      options: GrepOptions & { details: true },
    ): Array<GrepMatchDetail<T>>;

    (pattern: string | RegExp, options?: GrepOptions): Array<T>;
  };
}

declare interface GrepOptions {
  /**
   * When `inverse` is true, the grep function returns those lines which DON'T
   * match the pattern, instead of those which do. Defaults to `false`.
   *
   * **Example**
   * ```ts
   * const fruits = "apple\nbanana\ncherry";
   * const nonMatching = grepString(fruits, /an/, { inverse: true });
   * console.log(nonMatching); // ["apple", "cherry"]
   * ```
   */
  inverse?: boolean;

  /**
   * When `details` is true, the grep function returns an array of
   * {@link GrepMatchDetail} objects instead of an array of strings. Defaults to
   * `false`.
   *
   * **Example**
   * ```ts
   * const fruits = "apple\nbanana\ncherry";
   * const details = grepString(fruits, /an/, { details: true });
   * console.log(details[0].lineNumber, details[0].lineContent);
   * ```
   */
  details?: boolean;
}

/**
 * When `grepString`, `grepArray`, `grepFile`, or `String.prototype.grep` are
 * called with the `{ details: true }` option set, an Array of `GrepMatchDetail`
 * objects is returned.
 *
 * **Example**
 * ```ts
 * const [detail] = grepString("apple\nbanana", /an/, { details: true });
 * console.log(detail.lineNumber, detail.lineContent, detail.matches);
 * ```
 */
declare interface GrepMatchDetail<ItemType = string> {
  lineNumber: number;
  lineContent: ItemType;
  matches: RegExpMatchArray;

  /**
   * Same as lineNumber - 1.
   *
   * **Example**
   * ```ts
   * const [detail] = grepString("apple\nbanana", /an/, { details: true });
   * console.log(detail.index === detail.lineNumber - 1);
   * ```
   */
  index: number;
  /**
   * Alias for lineContent.
   *
   * **Example**
   * ```ts
   * const [detail] = grepString("apple\nbanana", /an/, { details: true });
   * console.log(detail.content === detail.lineContent);
   * ```
   */
  content: ItemType;
}
