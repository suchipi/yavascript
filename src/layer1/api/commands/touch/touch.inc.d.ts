/**
 * If the file at `path` exists, update its creation/modification timestamps.
 *
 * Otherwise, create an empty file at that path.
 *
 * @param path The target path for the file.
 *
 * **Example**
 * ```ts
 * touch("build-finished.txt");
 * ```
 */
declare function touch(path: string | Path): void;
