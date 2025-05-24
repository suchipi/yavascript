- [chmod (Chmod)](#chmod-chmod)
- [Chmod (interface)](#chmod-interface)
  - [Chmod(...) (call signature)](#chmod-call-signature)
  - [Chmod(...) (call signature)](#chmod-call-signature-1)
- [Chmod (exported namespace)](#chmod-exported-namespace)
  - [Chmod.Who (exported type)](#chmodwho-exported-type)
  - [Chmod.Operation (exported type)](#chmodoperation-exported-type)
  - [Chmod.Permission (exported type)](#chmodpermission-exported-type)

# chmod (Chmod)

Set the permission bits for the specified file.

Provides the same functionality as the unix binary of the same name.

```ts
const chmod: Chmod;
```

# Chmod (interface)

The interface for the global function `chmod`, which has two call signatures.

```ts
interface Chmod {
  (permissions: number | string, path: string | Path): void;
  (
    operation: Chmod.Operation,
    permissions: Record<Chmod.Who, Chmod.Permission>,
    path: string | Path
  ): void;
}
```

## Chmod(...) (call signature)

Set the permission bits for the specified file.

Provides the same functionality as the unix binary of the same name.

- `@param` _permissions_ — The permission bits to set. This can be a number, or a string containing an octal number.
- `@param` _path_ — The path to the file.

```ts
(permissions: number | string, path: string | Path): void;
```

## Chmod(...) (call signature)

Apply a change to the permission bits for the specified file.

Provides the same functionality as the unix binary of the same name.

- `@param` _operation_ — What to do to the bits; can be "add", "set", or "remove".
- `@param` _permissions_ — An object describing the changes (see below).
- `@param` _path_ — The path to the file.

Each of the `permissions` object's own property keys must be one of these
strings:

- `"user"`
- `"group"`
- `"others"`
- `"all"` (meaning "user", "group", and "others")
- `"u"` (alias for "user")
- `"g"` (alias for "group")
- `"o"` (alias for "others")
- `"a"` (alias for "all")
- `"ug"` ("user" plus "group")
- `"go"` ("group" plus "others")
- `"uo"` ("user" plus "others")

and their values must be one of these strings:

- `"read"` (permission to read the contents of the file)
- `"write"` (permission to write to the file's contents)
- `"execute"` (permission to run the file as an executable)
- `"readwrite"` (both "read" and "write")
- `"none"` (no permissions)
- `"full"` ("read", "write", and "execute")
- `"r"` (alias for "read")
- `"w"` (alias for "write")
- `"x"` (alias for "execute")
- `"rw"` (alias for "readwrite")
- `"rx"` ("read" and "execute")
- `"wx"` ("write" and "execute")
- `"rwx"` (alias for "full")

Some example objects:

```json
{ user: "readwrite", group: "read", others: "none" }
{ ug: "rw", o: "w" }
{ all: "full" }
```

```ts
(operation: Chmod.Operation, permissions: Record<Chmod.Who, Chmod.Permission>, path: string | Path): void;
```

# Chmod (exported namespace)

```ts
namespace Chmod {
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
  export type Operation = "add" | "set" | "remove";
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
```

## Chmod.Who (exported type)

A string representing who a permission applies to.

```ts
type Who =
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

## Chmod.Operation (exported type)

A string representing how the permissions should be changed.

```ts
type Operation = "add" | "set" | "remove";
```

## Chmod.Permission (exported type)

A string representing the access level for the given permission.

```ts
type Permission =
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
