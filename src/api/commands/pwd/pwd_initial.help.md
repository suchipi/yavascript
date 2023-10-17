# `pwd.initial` - The initial pwd (when yavascript starts)

`pwd.initial` is a frozen, read-only `Path` object containing what `pwd()` was when yavascript first started up.

```ts
// Defined in yavascript/src/api/commands/pwd
declare const pwd.initial: Path;
```
