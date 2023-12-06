# `Path` - work with filesystem paths

`Path` is a class which represents a filesystem path string. The class contains various methods that make it easy to work with filesystem paths; there are methods for adding/removing path components, converting between absolute and relative paths, getting the basename and dirname, and more.

All functions in yavascript which accept path strings as arguments also transparently accept Path objects. As such, it is recommended that all filesystem paths in your programs are Path objects rather than strings.

Every Path object has two properties: `segments` and `separator`. `segments` is an Array of strings containing all the non-slash portions of the path. For example, the path "one/two/three" would have segments `["one", "two", "three"]`. `separator` is which slash is used to separate the segments; either `/` or `\`.

A Path object can represent either a POSIX-style path or a win32-style path. For the win32 style, UNC paths are supported. POSIX-style paths starting with "/" (eg. "/usr/bin") have an empty string at the beginning of their segments array to represent the left-hand-side of the leading slash. For instance, "/usr/bin" would have segments `["", "usr", "bin"]`.

## Static properties and methods of the Path class

For more information about each of these, see its corresponding help page. For instance, help for the static method "detectSeparator" can be viewed with `help(Path.detectSeparator)`.

- OS_SEGMENT_SEPARATOR (string)
- OS_ENV_VAR_SEPARATOR (string)
- OS_PROGRAM_EXTENSIONS (Set of strings)
- splitToSegments (Function)
- detectSeparator (Function)
- join (Function)
- resolve (Function)
- normalize (Function)
- isAbsolute (Function)
- from (Function)

## Instance properties and methods of the Path class

For more information about each of these, see its corresponding help page. For instance, help for the instance method "isAbsolute" function can be viewed with `help(Path.prototype.isAbsolute)`.

- segments (Array of strings)
- separator (string)
- resolve (Function)
- normalize (Function)
- concat (Function)
- isAbsolute (Function)
- clone (Function)
- relativeTo (Function)
- toString (Function)
- toJSON (Function)
- basename (Function)
- extname (Function)
- dirname (Function)
- startsWith (Function)
- endsWith (Function)
- indexOf (Function)
- includes (Function)
- replace (Function)
- replaceAll (Function)
- replaceLast (Function)

---

```ts
// Defined in yavascript/src/api/path
declare class Path {
  constructor(...inputs: Array<string | Path | Array<string | Path>>);

  static readonly OS_SEGMENT_SEPARATOR: string;
  static readonly OS_ENV_VAR_SEPARATOR: string;
  static readonly OS_PROGRAM_EXTENSIONS: Set<string>;

  static splitToSegments(inputParts: Array<string> | string): Array<string>;
  static detectSeparator(
    input: Array<string> | string,
    fallback: string = Path.OS_SEGMENT_SEPARATOR
  ): string;
  static join(...inputs: Array<string | Path | Array<string | Path>>): Path;
  static resolve(...inputs: Array<string | Path | Array<string | Path>>): Path;
  static normalize(
    ...inputs: Array<string | Path | Array<string | Path>>
  ): Path;
  static isAbsolute(path: string | Path): boolean;
  static from(segments: Array<string>, separator: string): Path;

  segments: Array<string>;
  separator: string;

  resolve(...subpaths: Array<string | Path>): Path;
  normalize(): Path;
  concat(...other: Array<string | Path | Array<string | Path>>): Path;
  isAbsolute(): boolean;
  clone(): this;
  relativeTo(dir: Path | string, options?: { noLeadingDot?: boolean }): Path;
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
