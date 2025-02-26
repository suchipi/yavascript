- [ls (function)](#ls-function)

# ls (function)

Returns the contents of a directory, as absolute paths. `.` and `..` are
omitted.

```ts
declare function ls(dir?: string | Path): Array<Path>;
```
