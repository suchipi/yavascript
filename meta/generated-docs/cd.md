- [cd (function)](#cd-function)

# cd (function)

Changes the process's current working directory to the specified path. If no
path is specified, moves to the user's home directory.

Provides the same functionality as the shell builtin of the same name.

```ts
declare function cd(path?: string | Path): void;
```
