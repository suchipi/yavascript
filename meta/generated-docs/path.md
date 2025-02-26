- [Path (class)](#path-class)
  - [Path.OS_SEGMENT_SEPARATOR (static property)](#pathos_segment_separator-static-property)
  - [Path.OS_ENV_VAR_SEPARATOR (static property)](#pathos_env_var_separator-static-property)
  - [Path.OS_PROGRAM_EXTENSIONS (static property)](#pathos_program_extensions-static-property)
  - [Path.splitToSegments (static method)](#pathsplittosegments-static-method)
  - [Path.detectSeparator (static method)](#pathdetectseparator-static-method)
  - [Path.normalize (static method)](#pathnormalize-static-method)
  - [Path.isAbsolute (static method)](#pathisabsolute-static-method)
  - [Path.prototype.segments (property)](#pathprototypesegments-property)
  - [Path.prototype.separator (string property)](#pathprototypeseparator-string-property)
  - [Path (constructor)](#path-constructor)
  - [Path.fromRaw (static method)](#pathfromraw-static-method)
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

# Path (class)

An object that represents a filesystem path.

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
  segments: Array<string>;
  separator: string;
  constructor(...inputs: Array<string | Path | Array<string | Path>>);
  static fromRaw(segments: Array<string>, separator?: string): Path;
  normalize(): Path;
  concat(...other: Array<string | Path | Array<string | Path>>): Path;
  isAbsolute(): boolean;
  clone(): this;
  relativeTo(
    dir: Path | string,
    options?: {
      noLeadingDot?: boolean;
    }
  ): Path;
  toString(): string;
  toJSON(): string;
  basename(): string;
  extname(options?: { full?: boolean }): string;
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

The character used to separate path segments on this OS.

```ts
static readonly OS_SEGMENT_SEPARATOR: "/" | "\\";
```

## Path.OS_ENV_VAR_SEPARATOR (static property)

The character used to separate entries within the PATH environment
variable on this OS.

```ts
static readonly OS_ENV_VAR_SEPARATOR: ":" | ";";
```

## Path.OS_PROGRAM_EXTENSIONS (static property)

A list of suffixes that could appear in the filename for a program on the
current OS. For instance, on Windows, programs often end with ".exe".

On Unix-like OSes, this is empty. On Windows, it's based on `env.PATHEXT`.

```ts
static readonly OS_PROGRAM_EXTENSIONS: ReadonlySet<string>;
```

## Path.splitToSegments (static method)

Split one or more path strings into an array of path segments.

```ts
static splitToSegments(inputParts: Array<string> | string): Array<string>;
```

## Path.detectSeparator (static method)

Search the provided path string or strings for a path separator character,
and return it. If none is found, return `fallback`, which defaults to the
OS's path segment separator.

```ts
static detectSeparator<Fallback extends string | null = string>(input: Array<string> | string, fallback: Fallback = Path.OS_SEGMENT_SEPARATOR): string | Fallback;
```

## Path.normalize (static method)

Concatenates the input path(s) and then resolves all non-leading `.` and
`..` segments.

```ts
static normalize(...inputs: Array<string | Path | Array<string | Path>>): Path;
```

## Path.isAbsolute (static method)

Return whether the provided path is absolute; that is, whether it
starts with either `/` or a drive letter (ie `C:`).

```ts
static isAbsolute(path: string | Path): boolean;
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

Will be either `/` or `\`.

```ts
separator: string;
```

## Path (constructor)

Create a new Path object using the provided input(s).

```ts
constructor(...inputs: Array<string | Path | Array<string | Path>>);
```

## Path.fromRaw (static method)

Create a new Path object using the provided segments and separator.

If unspecified, `separator` defaults to `Path.OS_SEGMENT_SEPARATOR`.

```ts
static fromRaw(segments: Array<string>, separator?: string): Path;
```

## Path.prototype.normalize (method)

Resolve all non-leading `.` and `..` segments in this path.

```ts
normalize(): Path;
```

## Path.prototype.concat (method)

Create a new Path by appending additional path segments onto the end of
this Path's segments.

The returned path will use this path's separator.

```ts
concat(...other: Array<string | Path | Array<string | Path>>): Path;
```

## Path.prototype.isAbsolute (method)

Return whether this path is absolute; that is, whether it starts with
either `/`, `\`, or a drive letter (ie `C:`).

```ts
isAbsolute(): boolean;
```

## Path.prototype.clone (method)

Make a second Path object containing the same segments and separator as
this one.

Note that although it contains the same segments, the new Path does not use
the same Array instance for segments as this one.

```ts
clone(): this;
```

## Path.prototype.relativeTo (method)

Express this path relative to `dir`.

- `@param` _dir_ — The directory to create a new path relative to.
- `@param` _options_ — Options that affect the resulting path.

```ts
relativeTo(dir: Path | string, options?: {
  noLeadingDot?: boolean;
}): Path;
```

## Path.prototype.toString (method)

Turn this path into a string by joining its segments using its separator.

```ts
toString(): string;
```

## Path.prototype.toJSON (method)

Alias for `toString`; causes Path objects to be serialized as strings when
they (or an object referencing them) are passed into JSON.stringify.

```ts
toJSON(): string;
```

## Path.prototype.basename (method)

Return the final path segment of this path. If this path has no path
segments, the empty string is returned.

```ts
basename(): string;
```

## Path.prototype.extname (method)

Return the trailing extension of this path. The `options` parameter works
the same as the global `extname`'s `options` parameter.

```ts
extname(options?: {
  full?: boolean;
}): string;
```

## Path.prototype.dirname (method)

Return a new Path containing all of the path segments in this one except
for the last one; ie. the path to the directory that contains this path.

```ts
dirname(): Path;
```

## Path.prototype.startsWith (method)

Return whether this path starts with the provided value, by comparing one
path segment at a time.

The starting segments of this path must _exactly_ match the segments in the
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

Return whether this path ends with the provided value, by comparing one
path segment at a time.

The ending segments of this path must _exactly_ match the segments in the
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

Return the path segment index at which `value` appears in this path, or
`-1` if it doesn't appear in this path.

- `@param` _value_ — The value to search for. If the value contains more than one path segment, the returned index will refer to the location of the value's first path segment.
- `@param` _fromIndex_ — The index into this path's segments to begin searching at. Defaults to `0`.

```ts
indexOf(value: string | Path | Array<string | Path>, fromIndex?: number | undefined): number;
```

## Path.prototype.includes (method)

Return whether `value` appears in this path.

- `@param` _value_ — The value to search for.
- `@param` _fromIndex_ — The index into this path's segments to begin searching at. Defaults to `0`.

```ts
includes(value: string | Path | Array<string | Path>, fromIndex?: number | undefined): boolean;
```

## Path.prototype.replace (method)

Return a new Path wherein the segments in `value` have been replaced with
the segments in `replacement`. If the segments in `value` are not present
in this path, a clone of this path is returned.

Note that only the first match is replaced.

- `@param` _value_ — What should be replaced
- `@param` _replacement_ — What it should be replaced with

```ts
replace(value: string | Path | Array<string | Path>, replacement: string | Path | Array<string | Path>): Path;
```

## Path.prototype.replaceAll (method)

Return a new Path wherein all occurrences of the segments in `value` have
been replaced with the segments in `replacement`. If the segments in
`value` are not present in this path, a clone of this path is returned.

- `@param` _value_ — What should be replaced
- `@param` _replacement_ — What it should be replaced with

```ts
replaceAll(value: string | Path | Array<string | Path>, replacement: string | Path | Array<string | Path>): Path;
```

## Path.prototype.replaceLast (method)

Return a copy of this path but with the final segment replaced with `replacement`

- `@param` _replacement_ — The new final segment(s) for the returned Path

```ts
replaceLast(replacement: string | Path | Array<string | Path>): Path;
```
