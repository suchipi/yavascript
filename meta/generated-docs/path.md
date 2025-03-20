- [Path (class)](#path-class)
  - [Path.OS_SEGMENT_SEPARATOR (static property)](#pathos_segment_separator-static-property)
  - [Path.OS_ENV_VAR_SEPARATOR (static property)](#pathos_env_var_separator-static-property)
  - [Path.OS_PROGRAM_EXTENSIONS (static property)](#pathos_program_extensions-static-property)
  - [Path.splitToSegments (static method)](#pathsplittosegments-static-method)
  - [Path.detectSeparator (static method)](#pathdetectseparator-static-method)
  - [Path.normalize (static method)](#pathnormalize-static-method)
  - [Path.isAbsolute (static method)](#pathisabsolute-static-method)
  - [Path.fromRaw (static method)](#pathfromraw-static-method)
  - [Path (constructor)](#path-constructor)
  - [Path.prototype.segments (property)](#pathprototypesegments-property)
  - [Path.prototype.separator (string property)](#pathprototypeseparator-string-property)
  - [Path.prototype.normalize (method)](#pathprototypenormalize-method)
  - [Path.prototype.concat (method)](#pathprototypeconcat-method)
  - [Path.prototype.isAbsolute (method)](#pathprototypeisabsolute-method)
  - [Path.prototype.clone (method)](#pathprototypeclone-method)
  - [Path.prototype.relativeTo (method)](#pathprototyperelativeto-method)
  - [Path.prototype.toString (method)](#pathprototypetostring-method)
  - [Path.prototype.toJSON (method)](#pathprototypetojson-method)
  - [Path.prototype.basename (method)](#pathprototypebasename-method)
  - [Path.prototype.extname (method)](#pathprototypeextname-method)
  - [Path.prototype.dirname (method)](#pathprototypedirname-method)
  - [Path.prototype.startsWith (method)](#pathprototypestartswith-method)
  - [Path.prototype.endsWith (method)](#pathprototypeendswith-method)
  - [Path.prototype.indexOf (method)](#pathprototypeindexof-method)
  - [Path.prototype.includes (method)](#pathprototypeincludes-method)
  - [Path.prototype.replace (method)](#pathprototypereplace-method)
  - [Path.prototype.replaceAll (method)](#pathprototypereplaceall-method)
  - [Path.prototype.replaceLast (method)](#pathprototypereplacelast-method)
- [PathRelativeToOptions (exported interface)](#pathrelativetooptions-exported-interface)
  - [PathRelativeToOptions.noLeadingDot (boolean property)](#pathrelativetooptionsnoleadingdot-boolean-property)

# Path (class)

A class which represents a filesystem path. The class contains various
methods that make it easy to work with filesystem paths; there are methods
for adding/removing path components, converting between absolute and relative
paths, getting the basename and dirname, and more.

All functions in yavascript which accept path strings as arguments also
accept Path objects. As such, it is recommended that all filesystem paths in
your programs are Path objects rather than strings.

Every Path object has two properties: `segments` and `separator`. `segments`
is an Array of strings containing all the non-slash portions of the path. For
example, the path "one/two/three" would have segments `["one", "two",
"three"]`. `separator` is which slash is used to separate the segments;
either `"/"` or `"\"`.

A Path object can represent either a POSIX-style path or a win32-style path.
For the win32 style, UNC paths are supported. POSIX-style paths starting with
"/" (eg. "/usr/bin") have an empty string at the beginning of their segments
array to represent the left-hand-side of the leading slash. For instance,
"/usr/bin" would have segments `["", "usr", "bin"]`.

```ts
declare class Path {
  static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";
  static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";
  static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;
  static splitToSegments(inputParts: Array<string> | string): Array<string>;
  static detectSeparator<Fallback extends string | null = string>(
    input: Array<string> | string,
    fallback: Fallback = Path.OS_SEGMENT_SEPARATOR
  ): string | Fallback;
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path;
  static isAbsolute(path: string | Path): boolean;
  static fromRaw(segments: Array<string>, separator?: string): Path;
  constructor(...inputs: Array<string | Path | Array<string | Path>>);
  segments: Array<string>;
  separator: string;
  normalize(): Path;
  concat(...other: Array<string | Path | Array<string | Path>>): Path;
  isAbsolute(): boolean;
  clone(): this;
  relativeTo(dir: Path | string, options?: PathRelativeToOptions): Path;
  toString(): string;
  toJSON(): string;
  basename(): string;
  extname(options?: ExtnameOptions): string;
  dirname(): Path;
  startsWith(value: string | Path | Array<string | Path>): boolean;
  endsWith(value: string | Path | Array<string | Path>): boolean;
  indexOf(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): number;
  includes(
    value: string | Path | Array<string | Path>,
    fromIndex?: number | undefined
  ): boolean;
  replace(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;
  replaceAll(
    value: string | Path | Array<string | Path>,
    replacement: string | Path | Array<string | Path>
  ): Path;
  replaceLast(replacement: string | Path | Array<string | Path>): Path;
}
```

## Path.OS_SEGMENT_SEPARATOR (static property)

The character used to separate path segments on the current operating
system where yavascript is running.

Its value is either a forward slash (`"/"`) or a backslash (`"\"`). Its value
is a backslash on windows, and a forward slash on all other operating
systems.

```ts
static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";
```

## Path.OS_ENV_VAR_SEPARATOR (static property)

The character used to separate entries within the system's `PATH`
environment variable on the current operating system where yavascript is
running.

The `PATH` environment variable contains a list of folders wherein
command-line programs can be found, separated by either a colon (`:`) or a
semicolon (`;`). The value of `OS_ENV_VAR_SEPARATOR` is a semicolon on
windows, and a colon on all other operating systems.

The `PATH` environment variable can be accessed by yavascript programs via
`env.PATH`. Therefore, one can contain a list of all entries in the `PATH`
environment variable via:

```ts
const folders: Array<string> = env.PATH.split(Path.OS_ENV_VAR_SEPARATOR);
```

```ts
static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";
```

## Path.OS_PROGRAM_EXTENSIONS (static property)

A Set of filename extension strings that command-line programs may end with
on the current operating system where yavascript is running. For instance,
on Windows, programs often end with ".exe". Each of these strings contains
a leading dot (`.`).

On windows, this value is based on the `PATHEXT` environment variable,
which defaults to ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"
on Windows Vista and up. If `PATHEXT` is not defined, that default value is
used.

On all other operating systems, this Set is empty.

```ts
static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;
```

## Path.splitToSegments (static method)

Converts a string (or array of strings) into an array of path segment
strings (the parts between the slashes).

Example:

```ts
const input = ["hi", "there/every/one", "yeah\\yup"];
const result = Path.splitToSegments(input);
// result is ["hi", "there", "every", "one", "yeah", "yup"]
```

```ts
static splitToSegments(inputParts: Array<string> | string): Array<string>;
```

## Path.detectSeparator (static method)

Searches the provided path string or strings for a path separator character
(either forward slash or backslash), and returns the one it finds. If
neither is found, it returns the `fallback` arg, which defaults to the
current OS's path segment separator (`Path.OS_SEGMENT_SEPARATOR`).

```ts
static detectSeparator<Fallback extends string | null = string>(input: Array<string> | string, fallback: Fallback = Path.OS_SEGMENT_SEPARATOR): string | Fallback;
```

## Path.normalize (static method)

Creates a new Path by concatenating the input path(s) and then resolving all
non-leading `.` and `..` segments. In other words:

- Segments containing `.` are removed
- Segments containing `..` are removed, along with the segment preceding
  them.

Note that any `.` or `..` segments at the beginning of the path (ie.
"leading segments") are not removed.

```ts
static normalize(...inputs: Array<string | Path | Array<string | Path>>): Path;
```

## Path.isAbsolute (static method)

Returns a boolean indicating whether the provided path is absolute; that
is, whether it starts with either a slash (`/` or `\`) or a drive letter
(ie `C:`).

Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered
absolute.

```ts
static isAbsolute(path: string | Path): boolean;
```

## Path.fromRaw (static method)

Creates a new Path containing the user-provided segments and separator. In
most cases, you won't need to do this, and can use `new Path(...)` instead.

If unspecified, the `separator` parameter defaults to
`Path.OS_SEGMENT_SEPARATOR`.

```ts
static fromRaw(segments: Array<string>, separator?: string): Path;
```

## Path (constructor)

Creates a new Path object using the provided input(s), which will be
concatenated together in order left-to-right.

```ts
constructor(...inputs: Array<string | Path | Array<string | Path>>);
```

## Path.prototype.segments (property)

An array of the path segments that make up this path.

For `/tmp/foo.txt`, it'd be `["", "tmp", "foo.txt"]`.

For `C:\something\somewhere.txt`, it'd be `["C:", "something", "somewhere.txt"]`.

```ts
segments: Array<string>;
```

## Path.prototype.separator (string property)

The path separator that should be used to turn this path into a string.

Will be either `"/"` or `"\"`.

```ts
separator: string;
```

## Path.prototype.normalize (method)

Creates a new Path by resolving all non-leading `.` and `..` segments in
the target Path. In other words:

- Segments containing `.` are removed
- Segments containing `..` are removed, along with the segment preceding
  them.

Note that any `.` or `..` segments at the beginning of the path (ie.
"leading segments") are not removed.

```ts
normalize(): Path;
```

## Path.prototype.concat (method)

Creates a new Path by appending additional path segments onto the end of
the target Path's segments.

The returned Path will use the same separator as the target Path.

```ts
concat(...other: Array<string | Path | Array<string | Path>>): Path;
```

## Path.prototype.isAbsolute (method)

Returns a boolean indicating whether the target Path is absolute; that
is, whether it starts with either a slash (`/` or `\`) or a drive letter
(ie `C:`).

Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered
absolute.

```ts
isAbsolute(): boolean;
```

## Path.prototype.clone (method)

Creates a new Path object containing the same segments and separator as
the target Path.

Note that although it contains the same segments, the new Path does not use
the same Array instance for segments as the target Path is was cloned from.

```ts
clone(): this;
```

## Path.prototype.relativeTo (method)

Creates a new Path which expresses the target Path relative to `dir`.

- `@param` _dir_ — The directory to create a new path relative to.
- `@param` _options_ — Options that affect the resulting path (see [PathRelativeToOptions](/meta/generated-docs/path.md#pathrelativetooptions-interface)).

```ts
relativeTo(dir: Path | string, options?: PathRelativeToOptions): Path;
```

## Path.prototype.toString (method)

Turns the target Path into a string by joining its segments using its
separator as the delimiter.

```ts
toString(): string;
```

## Path.prototype.toJSON (method)

Alias for `toString`. The presence of this method causes Path objects to be
serialized as strings when they (or an object referencing them) get(s) passed
into JSON.stringify.

```ts
toJSON(): string;
```

## Path.prototype.basename (method)

Returns the final segment of the target Path. If the target Path has no
segments, an empty string (`""`) is returned.

```ts
basename(): string;
```

## Path.prototype.extname (method)

Returns the trailing file extension of this path.

- `@param` _options_ — Works the same as the options parameter for the global [extname](/meta/generated-docs/extname.md#extname-function) (see [ExtnameOptions](/meta/generated-docs/extname.md#extnameoptions-interface)).

```ts
extname(options?: ExtnameOptions): string;
```

## Path.prototype.dirname (method)

Creates a new Path containing all of the segments in the target Path except
for the last one; ie. the path to the directory that contains the target Path.

```ts
dirname(): Path;
```

## Path.prototype.startsWith (method)

Returns a boolean indicating whether the target Path starts with the
provided value, by comparing one path segment at a time.

The starting segments of the target Path must _exactly_ match the segments in the
provided value.

This means that, given two Paths A and B:

```
  A: Path { /home/user/.config }
  B: Path { /home/user/.config2 }
```

Path B does _not_ start with Path A, because `".config" !== ".config2"`.

```ts
startsWith(value: string | Path | Array<string | Path>): boolean;
```

## Path.prototype.endsWith (method)

Returns a boolean indicating whether the target Path ends with the provided
value, by comparing one path segment at a time.

The ending segments of the target Path must _exactly_ match the segments in the
provided value.

This means that, given two Paths A and B:

```
  A: Path { /home/1user/.config }
  B: Path { user/.config }
```

Path A does _not_ end with Path B, because `"1user" !== "user"`.

```ts
endsWith(value: string | Path | Array<string | Path>): boolean;
```

## Path.prototype.indexOf (method)

Returns the index at which `value` appears in the target Path's segments,
or `-1` if `value` doesn't appear in the target Path.

- `@param` _value_ — The value to search for. If the value contains more than one path segment, the returned index will refer to the location of the value's first path segment.
- `@param` _fromIndex_ — The index into the target Path's segments to begin searching at. Defaults to `0`.

```ts
indexOf(value: string | Path | Array<string | Path>, fromIndex?: number | undefined): number;
```

## Path.prototype.includes (method)

Returns a boolean indicating whether `value` appears in the target Path.

- `@param` _value_ — The value to search for.
- `@param` _fromIndex_ — The index into the target Path's segments to begin searching at. Defaults to `0`.

```ts
includes(value: string | Path | Array<string | Path>, fromIndex?: number | undefined): boolean;
```

## Path.prototype.replace (method)

Creates a new Path based on the target Path wherein the segments in `value`
have been replaced with the segments in `replacement`. If the segments in
`value` are not present in the target Path, a clone of the target Path is
returned.

Note that only the first match is replaced. To replace more than one match,
use [Path.prototype.replaceAll](/meta/generated-docs/path.md#pathprototypereplaceall-method).

- `@param` _value_ — What should be replaced
- `@param` _replacement_ — What it should be replaced with

See also [Path.prototype.replaceLast](/meta/generated-docs/path.md#pathprototypereplacelast-method).

```ts
replace(value: string | Path | Array<string | Path>, replacement: string | Path | Array<string | Path>): Path;
```

## Path.prototype.replaceAll (method)

Creates a new Path based on the target Path wherein all occurrences of the
segments in `value` have been replaced with the segments in `replacement`.
If the segments in `value` are not present in the target Path, a clone of
the target Path is returned.

Note that all matches are replaced. To replace only the first match,
use [Path.prototype.replace](/meta/generated-docs/path.md#pathprototypereplace-method).

- `@param` _value_ — What should be replaced
- `@param` _replacement_ — What it should be replaced with

See also [Path.prototype.replaceLast](/meta/generated-docs/path.md#pathprototypereplacelast-method).

```ts
replaceAll(value: string | Path | Array<string | Path>, replacement: string | Path | Array<string | Path>): Path;
```

## Path.prototype.replaceLast (method)

Creates a new Path based on the target Path but with the final segment
replaced with `replacement`.

If the target Path has no segments, the newly created Path will be the same
as `new Path(replacement)`; ie. non-empty.

- `@param` _replacement_ — The new final segment(s) for the returned Path

```ts
replaceLast(replacement: string | Path | Array<string | Path>): Path;
```

# PathRelativeToOptions (exported interface)

Options for [Path.prototype.relativeTo](/meta/generated-docs/path.md#pathprototyperelativeto-method).

```ts
interface PathRelativeToOptions {
  noLeadingDot?: boolean;
}
```

## PathRelativeToOptions.noLeadingDot (boolean property)

Defaults to false. When true, a leading `./` will be omitted from the
path, if present. Note that a leading `../` will never be omitted.

```ts
noLeadingDot?: boolean;
```
