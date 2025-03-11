- [glob (function)](#glob-function)
- [GlobOptions (type)](#globoptions-type)
  - [GlobOptions.followSymlinks (boolean property)](#globoptionsfollowsymlinks-boolean-property)
  - [GlobOptions.logging (object property)](#globoptionslogging-object-property)
    - [GlobOptions.logging.trace (function property)](#globoptionsloggingtrace-function-property)
    - [GlobOptions.logging.info (function property)](#globoptionslogginginfo-function-property)
  - [GlobOptions.dir (property)](#globoptionsdir-property)

# glob (function)

Search the filesystem for files matching the specified glob patterns.

Uses [minimatch](https://www.npmjs.com/package/minimatch) with its default
options.

```ts
declare function glob(
  patterns: string | Array<string>,
  options?: GlobOptions
): Array<Path>;
```

# GlobOptions (type)

Options for [glob](/meta/generated-docs/glob.md#glob-function).

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

## GlobOptions.followSymlinks (boolean property)

Whether to treat symlinks to directories as if they themselves were
directories, traversing into them.

Defaults to false.

```ts
followSymlinks?: boolean;
```

## GlobOptions.logging (object property)

Options which control logging.

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
  info?: (...args: Array<any>) => void;
};
```

### GlobOptions.logging.trace (function property)

If provided, this function will be called multiple times as `glob`
traverses the filesystem, to help you understand what's going on and/or
troubleshoot things. In most cases, it makes sense to use a logging
function here, like so:

```js
glob(["./*.js"], {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

### GlobOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages. Less verbose than `logging.trace`.

Defaults to the current value of [logger.info](/meta/generated-docs/logger.md#loggerinfo-function-property). `logger.info`
defaults to a function which writes to stderr.

```ts
info?: (...args: Array<any>) => void;
```

## GlobOptions.dir (property)

Directory to interpret glob patterns relative to. Defaults to `pwd()`.

```ts
dir?: string | Path;
```
