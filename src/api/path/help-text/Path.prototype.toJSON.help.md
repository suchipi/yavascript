# `Path.prototype.toJSON` - stringify a Path object

`Path.prototype.toJSON` is an alias for `Path.prototype.toString`. Its presence causes Path objects to be serialized as strings when they (or an object referencing them) are passed into JSON.stringify.

```ts
// Defined in yavascript/src/api/path
class Path {
  /* ... */
  toJSON(): string;
  /* ... */
}
```

See also `help(Path.prototype.toString)`.
