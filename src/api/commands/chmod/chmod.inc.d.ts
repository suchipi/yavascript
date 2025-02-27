/**
 * Set the permission bits for the specified file.
 *
 * @param permissions The permission bits to set. This can be a number, a string
 * containing an octal number, or an object.
 * @param path The path to the file.
 *
 * Provides the same functionality as the unix binary of the same name.
 *
 * The `permissions` argument can be either:
 *
 * - a number (best expressed using octal, eg `0o655`)
 * - a string (which will be interpreted as an octal number, eg `'777'`)
 * - or an object (see below).
 *
 * > NOTE: At this time there are no "add"/"remove" semantics; the existing
 * > permissions will be completely overwritten with your specified permissions.
 * > This will be changed later as this is not intuitive.
 *
 * When permissions is an object, each of the object's own properties' keys must
 * be one of these strings:
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
 * ```ts
 * chmod({ user: "readwrite", group: "read", others: "none" });
 * chmod({ ug: "rw", o: "w" });
 * chmod({ all: "full" });
 * ```
 */
declare function chmod(
  permissions:
    | number
    | string
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string | Path
): void;

/** A string representing who a permission applies to. */
declare type ChmodPermissionsWho =
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

/** A string representing the access level for the given permission. */
declare type ChmodPermissionsWhat =
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
