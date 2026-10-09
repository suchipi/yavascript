---
hide_title: true
---
## glob (function)

Searches the filesystem in order to resolve [UNIX-style glob
strings](https://man7.org/linux/man-pages/man7/glob.7.html) into an array of
matching filesystem paths.

Glob strings assist in succinctly finding and describing a set of files on
disk. For instance, to find the path of every `.js` file in the `src` folder,
one might write `src/*.js`.

The function `glob` can be used to turn one or more of these "glob strings" into an array of
`Path` objects.

`glob` uses [minimatch](https://www.npmjs.com/package/minimatch) with its
default options, which means it supports features like brace expanstion,
"globstar" (**) matching, and other features you would expect from a modern
globbing solution.

> When specifying more than one pattern string, paths must match ALL of the
> patterns to be included in the returned Array. In other words, it uses
> "logical AND" behavior when you give it more than one pattern.

**Example**

```ts
const markdownFiles = glob("*.md");
const sources = glob(["src/*.ts", "!src/*.d.ts"]);
console.log(markdownFiles, sources);
```

```ts
declare function glob(
  patterns: string | Array<string>,
  options?: GlobOptions,
): Array<Path>;
```

## GlobOptions (type)

Options for [glob](./glob.md#glob-function).

**Example**

```ts
const options: GlobOptions = {
  dir: pwd().concat("src"),
  followSymlinks: true,
};
const files = glob("*.ts", options);
```

```ts
declare type GlobOptions = {
  followSymlinks?: boolean;
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
  dir?: string | Path;
};
```

### GlobOptions.followSymlinks (boolean property)

Whether to treat symlinks to directories as if they themselves were
directories, traversing into them.

Defaults to false.

**Example**

```ts
const files = glob("*.md", { followSymlinks: true });
```

```ts
followSymlinks?: boolean;
```

### GlobOptions.logging (object property)

Options which control logging.

**Example**

```ts
glob("src/*.ts", {
  logging: { trace: console.error, info: console.error },
});
```

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
  info?: (...args: Array<any>) => void;
};
```

#### GlobOptions.logging.trace (function property)

If provided, this function will be called multiple times as `glob`
traverses the filesystem, to help you understand what's going on and/or
troubleshoot things. In most cases, it makes sense to use a logging
function here, like so:

```js
glob(["./*.js"], {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](./logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

#### GlobOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages. Less verbose than `logging.trace`.

Defaults to the current value of [logger.info](./logger.md#loggerinfo-function-property). `logger.info`
defaults to a function which writes to stderr.

**Example**

```ts
glob("src/*.ts", {
  logging: { info: (...args) => console.error("[glob]", ...args) },
});
```

```ts
info?: (...args: Array<any>) => void;
```

### GlobOptions.dir (property)

Directory to interpret glob patterns relative to. Must be an absolute
path. Defaults to `pwd()`.

**Example**

```ts
const files = glob("*.ts", { dir: pwd().concat("src") });
```

```ts
dir?: string | Path;
```
