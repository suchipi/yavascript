/**
 * Set the permission bits for the specified file.
 *
 * Provides the same functionality as the unix binary of the same name.
 */
declare const chmod: Chmod;

/**
 * The interface for the global function `chmod`, which has two call signatures.
 */
interface Chmod {
  /**
   * Set the permission bits for the specified file.
   *
   * Provides the same functionality as the unix binary of the same name.
   *
   * @param permissions The permission bits to set. This can be a number, or a string containing an octal number.
   * @param path The path to the file.
   */
  (permissions: number | string, path: string | Path): void;

  /**
   * Apply a change to the permission bits for the specified file.
   *
   * Provides the same functionality as the unix binary of the same name.
   *
   * @param operation What to do to the bits; can be "add", "set", or "remove".
   * @param permissions An object describing the changes (see below).
   * @param path The path to the file.
   *
   * Each of the `permissions` object's own property keys must be one of these
   * strings:
   *
   * - `"user"`
   * - `"group"`
   * - `"others"`
   * - `"all"` (meaning "user", "group", and "others")
   * - `"u"` (alias for "user")
   * - `"g"` (alias for "group")
   * - `"o"` (alias for "others")
   * - `"a"` (alias for "all")
   * - `"ug"` ("user" plus "group")
   * - `"go"` ("group" plus "others")
   * - `"uo"` ("user" plus "others")
   *
   * and their values must be one of these strings:
   *
   * - `"read"` (permission to read the contents of the file)
   * - `"write"` (permission to write to the file's contents)
   * - `"execute"` (permission to run the file as an executable)
   * - `"readwrite"` (both "read" and "write")
   * - `"none"` (no permissions)
   * - `"full"` ("read", "write", and "execute")
   * - `"r"` (alias for "read")
   * - `"w"` (alias for "write")
   * - `"x"` (alias for "execute")
   * - `"rw"` (alias for "readwrite")
   * - `"rx"` ("read" and "execute")
   * - `"wx"` ("write" and "execute")
   * - `"rwx"` (alias for "full")
   *
   * Some example objects:
   *
   * ```json
   * { user: "readwrite", group: "read", others: "none" }
   * { ug: "rw", o: "w" }
   * { all: "full" }
   * ```
   */
  <Operation extends Chmod.Operation>(
    operation: Operation,
    permissions: Operation extends "set"
      ? Record<Chmod.Who, Chmod.Permission>
      : Partial<Record<Chmod.Who, Chmod.Permission>>,
    path: string | Path
  ): void;
}

declare namespace Chmod {
  /** A string representing who a permission applies to. */
  export type Who =
    | "user"
    | "group"
    | "others"
    | "all"
    | "u"
    | "g"
    | "o"
    | "a"
    | "ug"
    | "go"
    | "uo";

  /** A string representing how the permissions should be changed. */
  export type Operation = "add" | "set" | "remove";

  /** A string representing the access level for the given permission. */
  export type Permission =
    | "read"
    | "write"
    | "execute"
    | "readwrite"
    | "none"
    | "full"
    | "r"
    | "w"
    | "x"
    | "rw"
    | "rx"
    | "wx"
    | "rwx";
}
