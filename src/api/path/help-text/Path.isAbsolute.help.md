# `Path.isAbsolute` - identify absolute/relative paths

`Path.isAbsolute` return whether the provided path is absolute; that is, whether it starts with either a slash (`/` or `\`) or a drive letter (ie `C:`).

Note that Windows UNC Paths (eg. `\\MYSERVER\share$\`) are considered absolute.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  static isAbsolute(path: string | Path): boolean;
  /* ... */
}
```

See also `help(Path.prototype.isAbsolute)`.
