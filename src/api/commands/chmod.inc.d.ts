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

/**
 * Set the permission bits for the specified file.
 *
 * @param permissions The permission bits to set. This can be a number, a string containing an octal number, or an object.
 * @param path The path to the file.
 */
declare function chmod(
  permissions:
    | number
    | string
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string | Path
): void;
