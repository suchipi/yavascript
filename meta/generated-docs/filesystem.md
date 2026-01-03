- [readFile (function)](#readfile-function)
  - [readFile(...) (call signature)](#readfile-call-signature)
  - [readFile(...) (call signature)](#readfile-call-signature-1)
  - [readFile(...) (call signature)](#readfile-call-signature-2)
  - [readFile(...) (call signature)](#readfile-call-signature-3)
- [writeFile (function)](#writefile-function)
- [isFile (function)](#isfile-function)
- [isDir (function)](#isdir-function)
- [isLink (function)](#islink-function)
- [isExecutable (function)](#isexecutable-function)
- [isReadable (function)](#isreadable-function)
- [isWritable (function)](#iswritable-function)
- [remove (function)](#remove-function)
- [exists (function)](#exists-function)
- [copy (function)](#copy-function)
- [CopyOptions (type)](#copyoptions-type)
  - [CopyOptions.whenTargetExists (property)](#copyoptionswhentargetexists-property)
  - [CopyOptions.logging (object property)](#copyoptionslogging-object-property)
    - [CopyOptions.logging.trace (function property)](#copyoptionsloggingtrace-function-property)
    - [CopyOptions.logging.info (function property)](#copyoptionslogginginfo-function-property)
- [rename (function)](#rename-function)

# readFile (function)

Read the contents of a file from disk.

With no options specified, it reads the file as UTF-8 and returns a string:

```ts
const contents = readFile("README.md");
console.log(contents);
// "# yavascript\n\nYavaScript is a cross-platform bash-like script runner and repl which is distributed as a single\nstatically-linked binary..."
```

But, if you pass `{ binary: true }` as the second argument, it returns an
ArrayBuffer containing the raw bytes from the file:

```ts
const contents = readFile("README.md", { binary: true });
console.log(contents);
// ArrayBuffer {
//   │0x00000000│ 23 20 79 61 76 61 73 63 72 69 70 74 0A 0A 59 61
//   │0x00000010│ 76 61 53 63 72 69 70 74 20 69 73 20 61 20 63 72
//   │0x00000020│ 6F 73 73 2D 70 6C 61 74 66 6F 72 6D 20 62 61 73
//   │0x00000030│ 68 2D 6C 69 6B 65 20 73 63 72 69 70 74 20 72 75
// ...
```

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

# rename (function)

Rename the file or directory at the specified path.

Provides the same functionality as the command `mv`.

```ts
declare function rename(from: string | Path, to: string | Path): void;
```
