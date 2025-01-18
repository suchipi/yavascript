# `Path.prototype.relativeTo` - make relative Paths

`Path.prototype.relativeTo` expresses the target Path relative to the `dir` argument.

If `options.noLeadingDot` is true, a leading `./` will be omitted from the path, if present. Note that a leading `../` will never be omitted.

`options.noLeadingDot` defaults to false.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  relativeTo(
    dir: Path | string,
    options?: {
      noLeadingDot?: boolean;
    }
  ): Path;
  /* ... */
}
```
