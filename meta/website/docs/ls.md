---
hide_title: true
---
## ls (function)

Returns the contents of a directory, sorted, as absolute paths. `.` and `..`
are omitted.

If `ls()` is called with no directory, the present working directory
(`pwd()`) is used.

**Example**

```ts
for (const path of ls("src")) {
  console.log(path.basename());
}
```

```ts
declare function ls(dir?: string | Path): Array<Path>;
```
