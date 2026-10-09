---
hide_title: true
---
## readFile (function)

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

### readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

**Example**

```ts
const text = readFile("README.md");
console.log(text.length);
```

```ts
(path: string | Path): string;
```

### readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

**Example**

```ts
const text = readFile("README.md", {});
console.log(text.length);
```

```ts
(path: string | Path, options: {}): string;
```

### readFile(...) (call signature)

Read the contents of a file from disk, as a UTF-8 string.

**Example**

```ts
const text = readFile("README.md", { binary: false });
console.log(text.length);
```

```ts
(path: string | Path, options: {
  binary: false;
}): string;
```

### readFile(...) (call signature)

Read the contents of a file from disk, as an ArrayBuffer.

**Example**

```ts
const buffer = readFile("image.png", { binary: true });
console.log(buffer.byteLength);
```

```ts
(path: string | Path, options: {
  binary: true;
}): ArrayBuffer;
```

## writeFile (function)

Write the contents of a string or ArrayBuffer to a file.

Strings are written using the UTF-8 encoding.

**Example**

```ts
writeFile("notes.txt", "remember to buy milk\n");
writeFile("bytes.bin", new Uint8Array([1, 2, 3]).buffer);
```

```ts
declare function writeFile(
  path: string | Path,
  data: string | ArrayBuffer,
): void;
```

## isFile (function)

Function which returns true if the path points to a regular file.

**Example**

```ts
if (isFile("README.md")) {
  console.log(readFile("README.md"));
}
```

```ts
declare function isFile(path: string | Path): boolean;
```

## isDir (function)

Function which returns true if the path points to a directory, or if the
path points to a symlink which points to a directory. Otherwise, it returns
false.

**Example**

```ts
if (!isDir("build")) {
  mkdir("build");
}
```

```ts
declare function isDir(path: string | Path): boolean;
```

## isLink (function)

Returns true if the path points to a symlink.

**Example**

```ts
if (isLink("link-to-readme")) {
  console.log(readlink("link-to-readme"));
}
```

```ts
declare function isLink(path: string | Path): boolean;
```

## isExecutable (function)

Returns true if the resource at the provided path can be executed by the
current user.

If nothing exists at that path, an error will be thrown.

**Example**

```ts
if (!isExecutable("script.sh")) {
  chmod("add", { user: "execute" }, "script.sh");
}
```

```ts
declare function isExecutable(path: string | Path): boolean;
```

## isReadable (function)

Returns true if the resource at the provided path can be read by the current
user.

If nothing exists at that path, an error will be thrown.

**Example**

```ts
if (isReadable("notes.txt")) {
  console.log(readFile("notes.txt"));
}
```

```ts
declare function isReadable(path: string | Path): boolean;
```

## isWritable (function)

Returns true if a resource at the provided path could be written to by the
current user.

**Example**

```ts
if (isWritable("notes.txt")) {
  writeFile("notes.txt", "remember to buy milk\n");
}
```

```ts
declare function isWritable(path: string | Path): boolean;
```

## remove (function)

Delete the file or directory at the specified path.

If the directory isn't empty, its contents will be deleted, too.

Provides the same functionality as the command `rm -r`.

**Example**

```ts
if (exists("build")) {
  remove("build");
}
```

```ts
declare function remove(path: string | Path): void;
```

## exists (function)

Returns true if a file or directory exists at the specified path.

Provides the same functionality as the command `test -e`.

**Example**

```ts
if (!exists("settings.toml")) {
  writeFile("settings.toml", 'name = "my-project"\n');
}
```

```ts
declare function exists(path: string | Path): boolean;
```

## copy (function)

Copies a file or folder from one location to another.
Folders are copied recursively.

Provides the same functionality as the command `cp -R`.

**Example**

```ts
copy("README.md", "README.backup.md");
copy("src", "src-backup");
```

```ts
declare function copy(
  from: string | Path,
  to: string | Path,
  options?: CopyOptions,
): void;
```

## CopyOptions (type)

Options for [copy](./filesystem.md#copy-function).

**Example**

```ts
const options: CopyOptions = { whenTargetExists: "skip" };
copy("src", "src-backup", options);
```

```ts
declare type CopyOptions = {
  whenTargetExists?: "overwrite" | "skip" | "error";
  logging?: {
    trace?: (...args: Array<any>) => void;
    info?: (...args: Array<any>) => void;
  };
};
```

### CopyOptions.whenTargetExists (property)

What to do when attempting to copy something into a location where
something else already exists.

Defaults to "error".

**Example**

```ts
copy("config.toml", "notes.txt", { whenTargetExists: "overwrite" });
```

```ts
whenTargetExists?: "overwrite" | "skip" | "error";
```

### CopyOptions.logging (object property)

Options which control logging.

**Example**

```ts
copy("src", "src-backup", {
  logging: { trace: console.error, info: console.error },
});
```

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
  info?: (...args: Array<any>) => void;
};
```

#### CopyOptions.logging.trace (function property)

If provided, this function will be called multiple times as `copy`
traverses the filesystem, to help you understand what's going on and/or
troubleshoot things. In most cases, it makes sense to use a logging
function here, like so:

```js
copy("./source", "./destination", {
  logging: { trace: console.log },
});
```

Defaults to the current value of [logger.trace](./logger.md#loggertrace-function-property). `logger.trace`
defaults to a no-op function.

```ts
trace?: (...args: Array<any>) => void;
```

#### CopyOptions.logging.info (function property)

An optional, user-provided logging function to be used for informational
messages.

Defaults to the current value of [logger.info](./logger.md#loggerinfo-function-property). `logger.info`
defaults to a function which writes to stderr.

**Example**

```ts
copy("src", "src-backup", {
  logging: { info: (...args) => console.error("[copy]", ...args) },
});
```

```ts
info?: (...args: Array<any>) => void;
```

## rename (function)

Rename the file or directory at the specified path.

Provides the same functionality as the command `mv`.

**Example**

```ts
rename("notes.txt", "notes-old.txt");
```

```ts
declare function rename(from: string | Path, to: string | Path): void;
```
