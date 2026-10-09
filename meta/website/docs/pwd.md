---
hide_title: true
---
## pwd (function)

Returns the process's current working directory.

Provides the same functionality as the shell builtin of the same name.

**Example**

```ts
const here = pwd();
console.log(here);
```

```ts
const pwd: {
  (): Path;
  readonly initial: Path;
};
```

### pwd(...) (call signature)

Returns the process's current working directory.

Provides the same functionality as the shell builtin of the same name.

**Example**

```ts
const readmePath = pwd().concat("README.md");
console.log(readmePath);
```

```ts
(): Path;
```

### pwd.initial (readonly Path property)

A frozen, read-only `Path` object containing what `pwd()` was when
yavascript first started up.

**Example**

```ts
cd("src");
cd(pwd.initial);
```

```ts
readonly initial: Path;
```
