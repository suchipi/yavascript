# `cd` - Change the current directory

Changes the process's current working directory to the specified path. If no path is specified, moves to the user's home directory.

Provides the same functionality as the shell builtin of the same name.

```ts
// Defined in yavascript/src/api/commands/cd
declare function cd(path?: string | Path): void;
```

See also `help(pwd)`.
