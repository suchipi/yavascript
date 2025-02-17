# readFile (function)

Read the contents of a file from disk.

```ts
const readFile: {
  (path: string | Path): string;
  (path: string | Path, options: {}): string;
  (
    path: string | Path,
    options: {
      binary: false;
    },
  ): string;
  (
    path: string | Path,
    options: {
      binary: true;
    },
  ): ArrayBuffer;
};
```

## readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

```ts
(path: string | Path): string;
```

## readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

```ts
(path: string | Path, options: {}): string;
```

## readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

```ts
(path: string | Path, options: {
  binary: false;
}): string;
```

## readFile(...) (call signature)

Read the contents of a file from disk, as an ArrayBuffer.

```ts
(path: string | Path, options: {
  binary: true;
}): ArrayBuffer;
```

# writeFile (function)

Write the contents of a string or ArrayBuffer to a file.

Strings are written using the UTF-8 encoding.

```ts
declare function writeFile(
  path: string | Path,
  data: string | ArrayBuffer,
): void;
```

# isFile (function)

Function which returns true if the path points to a regular file.

```ts
declare function isFile(path: string | Path): boolean;
```

# isDir (function)

Function which returns true if the path points to a directory, or if the
path points to a symlink which points to a directory. Otherwise, it returns
false.

```ts
declare function isDir(path: string | Path): boolean;
```

# isLink (function)

Returns true if the path points to a symlink.

```ts
declare function isLink(path: string | Path): boolean;
```

# isExecutable (function)

Returns true if the resource at the provided path can be executed by the
current user.

If nothing exists at that path, an error will be thrown.

```ts
declare function isExecutable(path: string | Path): boolean;
```

# isReadable (function)

Returns true if the resource at the provided path can be read by the current
user.

If nothing exists at that path, an error will be thrown.

```ts
declare function isReadable(path: string | Path): boolean;
```

# isWritable (function)

Returns true if a resource at the provided path could be written to by the
current user.

```ts
declare function isWritable(path: string | Path): boolean;
```

# remove (function)

Delete the file or directory at the specified path.

If the directory isn't empty, its contents will be deleted, too.

Provides the same functionality as the command `rm -rf`.

```ts
declare function remove(path: string | Path): void;
```

# exists (function)

Returns true if a file or directory exists at the specified path.

Provides the same functionality as the command `test -e`.

```ts
declare function exists(path: string | Path): boolean;
```

# CopyOptions (type)

Options for [copy](/meta/generated-docs/filesystem.md#copy-function).

```ts
declare type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
};
```

## CopyOptions.whenTargetExists (property)

What to do when attempting to copy something into a location where
something else already exists.

Defaults to "error".

```ts
whenTargetExists?: "overwrite" | "skip" | "error";
```

## CopyOptions.logging (object property)

Options which control logging.

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
  info?: (...args: Array<any>) => void;
};
```

### CopyOptions.logging.trace (function property)

If provided, this function will be called multiple times as `copy`
traverses the filesystem, to help you understand what's going on and/or
troubleshoot things. In most cases, it makes sense to use a logging
function here, like so:

```js
copy("./source", "./destination", {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

### CopyOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages.

Defaults to the current value of [logger.info](/meta/generated-docs/logger.md#loggerinfo-function-property). `logger.info`
defaults to a function which writes to stderr.

```ts
info?: (...args: Array<any>) => void;
```

# copy (function)

Copies a file or folder from one location to another.
Folders are copied recursively.

Provides the same functionality as the command `cp -R`.

```ts
declare function copy(
  from: string | Path,
  to: string | Path,
  options?: CopyOptions,
): void;
```

# rename (function)

Rename the file or directory at the specified path.

Provides the same functionality as the command `mv`.

```ts
declare function rename(from: string | Path, to: string | Path): void;
```
