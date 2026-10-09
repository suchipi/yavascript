/**
 * Read the contents of a file from disk.
 *
 * With no options specified, it reads the file as UTF-8 and returns a string:
 *
 * ```ts
 * const contents = readFile("README.md");
 * console.log(contents);
 * // "# yavascript\n\nYavaScript is a cross-platform bash-like script runner and repl which is distributed as a single\nstatically-linked binary..."
 * ```
 *
 * But, if you pass `{ binary: true }` as the second argument, it returns an
 * ArrayBuffer containing the raw bytes from the file:
 *
 * ```ts
 * const contents = readFile("README.md", { binary: true });
 * console.log(contents);
 * // ArrayBuffer {
 * //   │0x00000000│ 23 20 79 61 76 61 73 63 72 69 70 74 0A 0A 59 61
 * //   │0x00000010│ 76 61 53 63 72 69 70 74 20 69 73 20 61 20 63 72
 * //   │0x00000020│ 6F 73 73 2D 70 6C 61 74 66 6F 72 6D 20 62 61 73
 * //   │0x00000030│ 68 2D 6C 69 6B 65 20 73 63 72 69 70 74 20 72 75
 * // ...
 * ```
 */
declare const readFile: {
  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   *
   * **Example**
   * ```ts
   * const text = readFile("README.md");
   * console.log(text.length);
   * ```
   */
  (path: string | Path): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   *
   * **Example**
   * ```ts
   * const text = readFile("README.md", {});
   * console.log(text.length);
   * ```
   */
  (path: string | Path, options: {}): string;

  /**
   * Read the contents of a file from disk, as a UTF-8 string.
   *
   * **Example**
   * ```ts
   * const text = readFile("README.md", { binary: false });
   * console.log(text.length);
   * ```
   */
  (path: string | Path, options: { binary: false }): string;

  /**
   * Read the contents of a file from disk, as an ArrayBuffer.
   *
   * **Example**
   * ```ts
   * const buffer = readFile("image.png", { binary: true });
   * console.log(buffer.byteLength);
   * ```
   */
  (path: string | Path, options: { binary: true }): ArrayBuffer;
};

/**
 * Write the contents of a string or ArrayBuffer to a file.
 *
 * Strings are written using the UTF-8 encoding.
 *
 * **Example**
 * ```ts
 * writeFile("notes.txt", "remember to buy milk\n");
 * writeFile("bytes.bin", new Uint8Array([1, 2, 3]).buffer);
 * ```
 */
declare function writeFile(
  path: string | Path,
  data: string | ArrayBuffer,
): void;

/**
 * Function which returns true if the path points to a regular file.
 *
 * **Example**
 * ```ts
 * if (isFile("README.md")) {
 *   console.log(readFile("README.md"));
 * }
 * ```
 */
declare function isFile(path: string | Path): boolean;

/**
 * Function which returns true if the path points to a directory, or if the
 * path points to a symlink which points to a directory. Otherwise, it returns
 * false.
 *
 * **Example**
 * ```ts
 * if (!isDir("build")) {
 *   mkdir("build");
 * }
 * ```
 */
declare function isDir(path: string | Path): boolean;

/**
 * Returns true if the path points to a symlink.
 *
 * **Example**
 * ```ts
 * if (isLink("link-to-readme")) {
 *   console.log(readlink("link-to-readme"));
 * }
 * ```
 */
declare function isLink(path: string | Path): boolean;

/**
 * Returns true if the resource at the provided path can be executed by the
 * current user.
 *
 * If nothing exists at that path, an error will be thrown.
 *
 * **Example**
 * ```ts
 * if (!isExecutable("script.sh")) {
 *   chmod("add", { user: "execute" }, "script.sh");
 * }
 * ```
 */
declare function isExecutable(path: string | Path): boolean;

/**
 * Returns true if the resource at the provided path can be read by the current
 * user.
 *
 * If nothing exists at that path, an error will be thrown.
 *
 * **Example**
 * ```ts
 * if (isReadable("notes.txt")) {
 *   console.log(readFile("notes.txt"));
 * }
 * ```
 */
declare function isReadable(path: string | Path): boolean;

/**
 * Returns true if a resource at the provided path could be written to by the
 * current user.
 *
 * **Example**
 * ```ts
 * if (isWritable("notes.txt")) {
 *   writeFile("notes.txt", "remember to buy milk\n");
 * }
 * ```
 */
declare function isWritable(path: string | Path): boolean;

/**
 * Delete the file or directory at the specified path.
 *
 * If the directory isn't empty, its contents will be deleted, too.
 *
 * Provides the same functionality as the command `rm -r`.
 *
 * **Example**
 * ```ts
 * if (exists("build")) {
 *   remove("build");
 * }
 * ```
 */
declare function remove(path: string | Path): void;

/**
 * Returns true if a file or directory exists at the specified path.
 *
 * Provides the same functionality as the command `test -e`.
 *
 * **Example**
 * ```ts
 * if (!exists("settings.toml")) {
 *   writeFile("settings.toml", 'name = "my-project"\n');
 * }
 * ```
 */
declare function exists(path: string | Path): boolean;

/**
 * Copies a file or folder from one location to another.
 * Folders are copied recursively.
 *
 * Provides the same functionality as the command `cp -R`.
 *
 * **Example**
 * ```ts
 * copy("README.md", "README.backup.md");
 * copy("src", "src-backup");
 * ```
 */
declare function copy(
  from: string | Path,
  to: string | Path,
  options?: CopyOptions,
): void;

/**
 * Options for {@link copy}.
 *
 * **Example**
 * ```ts
 * const options: CopyOptions = { whenTargetExists: "skip" };
 * copy("src", "src-backup", options);
 * ```
 */
declare type CopyOptions = {
  /**
   * What to do when attempting to copy something into a location where
   * something else already exists.
   *
   * Defaults to "error".
   *
   * **Example**
   * ```ts
   * copy("config.toml", "notes.txt", { whenTargetExists: "overwrite" });
   * ```
   */
  whenTargetExists?: "overwrite" | "skip" | "error";

  /**
   * Options which control logging.
   *
   * **Example**
   * ```ts
   * copy("src", "src-backup", {
   *   logging: { trace: console.error, info: console.error },
   * });
   * ```
   */
  logging?: {
    /**
     * If provided, this function will be called multiple times as `copy`
     * traverses the filesystem, to help you understand what's going on and/or
     * troubleshoot things. In most cases, it makes sense to use a logging
     * function here, like so:
     *
     * ```js
     * copy("./source", "./destination", {
     *   logging: { trace: console.log },
     * });
     * ```
     *
     * Defaults to the current value of {@link logger.trace}. `logger.trace`
     * defaults to a no-op function.
     */
    trace?: (...args: Array<any>) => void;

    /**
     * An optional, user-provided logging function to be used for informational
     * messages.
     *
     * Defaults to the current value of {@link logger.info}. `logger.info`
     * defaults to a function which writes to stderr.
     *
     * **Example**
     * ```ts
     * copy("src", "src-backup", {
     *   logging: { info: (...args) => console.error("[copy]", ...args) },
     * });
     * ```
     */
    info?: (...args: Array<any>) => void;
  };
};

/**
 * Rename the file or directory at the specified path.
 *
 * Provides the same functionality as the command `mv`.
 *
 * **Example**
 * ```ts
 * rename("notes.txt", "notes-old.txt");
 * ```
 */
declare function rename(from: string | Path, to: string | Path): void;
