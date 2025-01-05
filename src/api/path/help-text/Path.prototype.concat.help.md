# `Path.prototype.concat` - append to the end of a Path

`Path.prototype.concat` creates a new Path by appending additional path segments onto the end of the target Path's segments.

The newly-created Path will use the target Path's separator.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  concat(...other: Array<string | Path | Array<string | Path>>): Path;
  /* ... */
}
```
