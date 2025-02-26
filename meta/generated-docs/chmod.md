- [ChmodPermissionsWho (type)](#chmodpermissionswho-type)
- [ChmodPermissionsWhat (type)](#chmodpermissionswhat-type)
- [chmod (function)](#chmod-function)

# ChmodPermissionsWho (type)

A string representing who a permission applies to.

```ts
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
```

# ChmodPermissionsWhat (type)

A string representing the access level for the given permission.

```ts
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
```

# chmod (function)

Set the permission bits for the specified file.

- `@param` _permissions_ — The permission bits to set. This can be a number, a string containing an octal number, or an object.
- `@param` _path_ — The path to the file.

```ts
declare function chmod(
  permissions:
    | number
    | string
    | Record<ChmodPermissionsWho, ChmodPermissionsWhat>,
  path: string | Path
): void;
```
