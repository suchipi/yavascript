# pwd (function)

Returns the process's current working directory.

Provides the same functionality as the shell builtin of the same name.

```ts
const pwd: {
  (): Path;
  readonly initial: Path;
};
```

## pwd(...) (call signature)

Returns the process's current working directory.

Provides the same functionality as the shell builtin of the same name.

```ts
(): Path;
```

## pwd.initial (Path property)

A frozen, read-only `Path` object containing what `pwd()` was when
yavascript first started up.

```ts
readonly initial: Path;
```
