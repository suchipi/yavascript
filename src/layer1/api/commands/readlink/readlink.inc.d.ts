/**
 * Reads a symlink.
 *
 * Returns the target of the symlink, which may be absolute or relative.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * **Example**
 * ```ts
 * const target = readlink("link-to-readme");
 * console.log(target);
 * ```
 */
declare function readlink(path: string | Path): Path;
