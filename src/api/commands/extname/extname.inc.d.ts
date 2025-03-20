/**
 * Returns the file extension of the file at a given path.
 *
 * If the file has no extension (eg `Makefile`, etc), then `''` will be
 * returned.
 *
 * @param pathOrFilename The input path
 * @param options Options which affect the return value. See {@link ExtnameOptions}.
 */
declare function extname(
  pathOrFilename: string | Path,
  options?: ExtnameOptions
): string;

/**
 * Options for {@link extname} and {@link Path.prototype.extname}.
 */
declare interface ExtnameOptions {
  /**
   * Whether to get compound extensions, like `.d.ts` or `.test.js`, instead of
   * just the final extension (`.ts` or `.js` in this example).
   */
  full?: boolean;
}
