/**
 * Changes the process's current working directory to the specified path. If no
 * path is specified, moves to the user's home directory.
 *
 * Provides the same functionality as the shell builtin of the same name.
 *
 * **Example**
 * ```ts
 * cd("src");
 * console.log(pwd().toString());
 * ```
 */
declare function cd(path?: string | Path): void;
