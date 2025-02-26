# scriptArgs (value)

Provides the command line arguments. The first argument is the script name.

```ts
var scriptArgs: Array<string>;
```

# FILE (interface)

An object representing a file handle.

```ts
declare interface FILE {
  target: string | number;
  close(): void;
  puts(...strings: Array<string>): void;
  printf(fmt: string, ...args: Array<any>): void;
  flush(): void;
  sync(): void;
  seek(offset: number, whence: number): void;
  tell(): number;
  tello(): BigInt;
  eof(): boolean;
  fileno(): number;
  read(buffer: ArrayBuffer, position: number, length: number): number;
  write(buffer: ArrayBuffer, position: number, length: number): number;
  writeTo(target: FILE, bufferSize: number, limit?: number): number;
  getline(): string | null;
  readAsString(maxSize?: number): string;
  getByte(): number;
  putByte(value: number): void;
  setvbuf(mode: number, size: number): void;
}
```

## FILE.target (property)

Human-readable description of where this FILE points.

If `target` is a number, the FILE was opened with fdopen, and `target` is
the fd. Otherwise, `target` will be an arbitrary string that describes the
file; it may be the absolute path to the file, the relative path to the
file at time of its opening, or some other string like "stdin" or
"tmpfile".

You should _not_ use this property for anything other than logging and
debugging. It is _only_ provided for debugging and/or troubleshooting
purposes. The value of this property could change at any time when
upgrading yavascript, even if upgrading by a minor or patch release.

```ts
target: string | number;
```

## FILE.close (method)

Close the file handle. Note that for files other than stdin/stdout/stderr,
the file will be closed automatically when the `FILE` object is
garbage-collected.

```ts
close(): void;
```

## FILE.puts (method)

Outputs the string with the UTF-8 encoding.

```ts
puts(...strings: Array<string>): void;
```

## FILE.printf (method)

Formatted printf.

The same formats as the standard C library `printf` are supported. Integer format types (e.g. `%d`) truncate the Numbers or BigInts to 32 bits. Use the `l` modifier (e.g. `%ld`) to truncate to 64 bits.

```ts
printf(fmt: string, ...args: Array<any>): void;
```

## FILE.flush (method)

Flush the buffered file. Wrapper for C `fflush`.

```ts
flush(): void;
```

## FILE.sync (method)

Sync the buffered file to disk. Wrapper for C `fsync`.

```ts
sync(): void;
```

## FILE.seek (method)

Seek to a given file position (whence is `std.SEEK_*`).

`offset` can be a number or a bigint.

```ts
seek(offset: number, whence: number): void;
```

## FILE.tell (method)

Return the current file position.

```ts
tell(): number;
```

## FILE.tello (method)

Return the current file position as a bigint.

```ts
tello(): BigInt;
```

## FILE.eof (method)

Return true if end of file.

```ts
eof(): boolean;
```

## FILE.fileno (method)

Return the associated OS handle.

```ts
fileno(): number;
```

## FILE.read (method)

Read `length` bytes from the file to the ArrayBuffer `buffer` at byte position `position` (wrapper to the libc `fread`). Returns the number of bytes read, or `0` if the end of the file has been reached.

```ts
read(buffer: ArrayBuffer, position: number, length: number): number;
```

## FILE.write (method)

Write `length` bytes from the ArrayBuffer `buffer` at byte position `position` into the file (wrapper to the libc `fwrite`). Returns the number of bytes written.

```ts
write(buffer: ArrayBuffer, position: number, length: number): number;
```

## FILE.writeTo (method)

Write this file into `target`, using a memory buffer of size `bufferSize`.

If `limit` is specified, only that amount of bytes will be read and
written. Otherwise, data is read and written until this file reaches EOF.

A `limit` of 0 is treated the same as not specifying a limit.

Internally, this function uses libc `fread` and `fwrite` in a loop.

Returns the number of bytes read and written.

```ts
writeTo(target: FILE, bufferSize: number, limit?: number): number;
```

## FILE.getline (method)

Return the next line from the file, assuming UTF-8 encoding, excluding the trailing line feed or EOF.

If the end of the file has been reached, then `null` will be returned instead of a string.

Note: Although the trailing line feed has been removed, a carriage return (`\r`) may still be present.

```ts
getline(): string | null;
```

## FILE.readAsString (method)

Read `maxSize` bytes from the file and return them as a string assuming UTF-8 encoding. If `maxSize` is not present, the file is read up its end.

```ts
readAsString(maxSize?: number): string;
```

## FILE.getByte (method)

Return the next byte from the file. Return -1 if the end of file is reached.

```ts
getByte(): number;
```

## FILE.putByte (method)

Write one byte to the file.

```ts
putByte(value: number): void;
```

## FILE.setvbuf (method)

Set the buffering mode and buffer size for the file stream (wrapper to the libc `setvbuf()`).

Note that unlike the libc setvbuf, the "buffer" argument is not supported, and therefore is not present.

- `@param` _mode_ — The buffering mode to use. It can be one of the following values: `std._IOFBF` for full buffering, `std._IOLBF` for line buffering, or `std._IONBF` for no buffering.
- `@param` _size_ — The size to resize the internal in-memory buffer for this file to.

```ts
setvbuf(mode: number, size: number): void;
```

# "quickjs:std" (namespace)

```ts
declare module "quickjs:std" {
  export function setExitCode(statusCode: number): void;
  export function getExitCode(): number;
  export function exit(statusCode?: number): never;
  export function loadFile(filename: string): string;
  export function isFILE(value: any): boolean;
  export function open(filename: string, flags: string): FILE;
  export function popen(command: string, flags: string): FILE;
  export function fdopen(fd: number, flags: string): FILE;
  export function tmpfile(): FILE;
  export function puts(...strings: Array<string>): void;
  export function printf(fmt: string, ...args: Array<any>): void;
  export function sprintf(fmt: string, ...args: Array<any>): void;
  var in_: FILE;
  export { in_ as in };
  export var out: FILE;
  export var err: FILE;
  export var SEEK_SET: number;
  export var SEEK_CUR: number;
  export var SEEK_END: number;
  export var _IOFBF: number;
  export var _IOLBF: number;
  export var _IONBF: number;
  export function getenv(name: string): string | undefined;
  export function setenv(name: string, value: string): void;
  export function unsetenv(name: string): void;
  export function getenviron(): {
    [key: string]: string | undefined;
  };
  export function getuid(): number;
  export function geteuid(): number;
  export function getgid(): number;
  export function getegid(): number;
  interface UrlGet {
    (url: string): string;
    (
      url: string,
      options: {
        binary: false;
      },
    ): string;
    (
      url: string,
      options: {
        full: false;
      },
    ): string;
    (
      url: string,
      options: {
        binary: false;
        full: false;
      },
    ): string;
    (
      url: string,
      options: {
        binary: true;
      },
    ): ArrayBuffer;
    (
      url: string,
      options: {
        binary: true;
        full: false;
      },
    ): ArrayBuffer;
    (
      url: string,
      options: {
        full: true;
      },
    ): {
      status: number;
      response: string;
      responseHeaders: string;
    };
    (
      url: string,
      options: {
        full: true;
        binary: false;
      },
    ): {
      status: number;
      response: string;
      responseHeaders: string;
    };
    (
      url: string,
      options: {
        full: true;
        binary: true;
      },
    ): {
      status: number;
      response: ArrayBuffer;
      responseHeaders: string;
    };
  }
  export var urlGet: UrlGet;
  export function parseExtJSON(str: string): any;
  export function strftime(
    maxBytes: number,
    format: string,
    time: Date | number,
  ): string;
}
```

## "quickjs:std".setExitCode (exported function)

Set the exit code that the process should exit with in the future, if it
exits normally.

Can only be called from the main thread.

This exit code will only be used if the process exits "normally", ie, when
there are no more pending JS tasks/listeners. If an unhandled exception is
thrown, the process will always exit with status `1`, regardless of the
status code passed to `setExitCode`. If someone calls [exit](/meta/generated-docs/exit.md#exit-function) and
passes in a status code, that status code will take precedence over the
status code passed to `setExitCode`.

- `@param` _statusCode_ — The future exit code; 0 for success, nonzero for failure.

```ts
function setExitCode(statusCode: number): void;
```

## "quickjs:std".getExitCode (exported function)

Return the exit code that was previously set by [setExitCode](/meta/generated-docs/libc.md#quickjsstdsetexitcode-exported-function), or 0 if
it hasn't yet been set.

Can only be called from the main thread.

```ts
function getExitCode(): number;
```

## "quickjs:std".exit (exported function)

Exit the process with the provided status code.

Can only be called from the main thread.

If `statusCode` is not provided, a value previously passed into
[setExitCode](/meta/generated-docs/libc.md#quickjsstdsetexitcode-exported-function) will be used. If no value was previously passed into
setExitCode, `0` will be used.

- `@param` _statusCode_ — The exit code; 0 for success, nonzero for failure.

```ts
function exit(statusCode?: number): never;
```

## "quickjs:std".loadFile (exported function)

Load the file `filename` and return it as a string assuming UTF-8 encoding.

- `@param` _filename_ — The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.

```ts
function loadFile(filename: string): string;
```

## "quickjs:std".isFILE (exported function)

Return a boolean indicating whether the provided value is a FILE object.

- `@param` _value_ — The value to check.
- `@returns` Whether the value was a `FILE` or not.

```ts
function isFILE(value: any): boolean;
```

## "quickjs:std".open (exported function)

Open a file (wrapper to the libc `fopen()`).
Return the FILE object.

- `@param` _filename_ — The relative or absolute path to the file to open. Relative paths are resolved relative to the process's current working directory.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
function open(filename: string, flags: string): FILE;
```

## "quickjs:std".popen (exported function)

Open a process by creating a pipe (wrapper to the libc `popen()`).
Return the FILE object.

- `@param` _command_ — The command line to execute. Gets passed via `/bin/sh -c`.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
function popen(command: string, flags: string): FILE;
```

## "quickjs:std".fdopen (exported function)

Open a file from a file handle (wrapper to the libc `fdopen()`).
Return the FILE object.

- `@param` _fd_ — The file handle to open.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
function fdopen(fd: number, flags: string): FILE;
```

## "quickjs:std".tmpfile (exported function)

Open a temporary file.
Return the FILE object.

- `@returns` The opened FILE object.

```ts
function tmpfile(): FILE;
```

## "quickjs:std".puts (exported function)

Equivalent to `std.out.puts(str)`.

```ts
function puts(...strings: Array<string>): void;
```

## "quickjs:std".printf (exported function)

Equivalent to `std.out.printf(fmt, ...args)`

```ts
function printf(fmt: string, ...args: Array<any>): void;
```

## "quickjs:std".sprintf (exported function)

Equivalent to the libc sprintf().

```ts
function sprintf(fmt: string, ...args: Array<any>): void;
```

## "quickjs:std".in\_ (FILE)

Wrapper to the libc file stdin.

```ts
var in_: FILE;
```

## "quickjs:std".out (exported FILE)

Wrapper to the libc file stdout.

```ts
var out: FILE;
```

## "quickjs:std".err (exported FILE)

Wrapper to the libc file stderr.

```ts
var err: FILE;
```

## "quickjs:std".SEEK_SET (exported number)

Constant for [FILE.seek](/meta/generated-docs/libc.md#fileseek-method). Declares that pointer offset should be relative to the beginning of the file. See also libc `fseek()`.

```ts
var SEEK_SET: number;
```

## "quickjs:std".SEEK_CUR (exported number)

Constant for [FILE.seek](/meta/generated-docs/libc.md#fileseek-method). Declares that the offset should be relative to the current position of the FILE handle. See also libc `fseek()`.

```ts
var SEEK_CUR: number;
```

## "quickjs:std".SEEK_END (exported number)

Constant for [FILE.seek](/meta/generated-docs/libc.md#fileseek-method). Declares that the offset should be relative to the end of the file. See also libc `fseek()`.

```ts
var SEEK_END: number;
```

## "quickjs:std".\_IOFBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/libc.md#filesetvbuf-method). Declares that the buffer mode should be 'full buffering'.

```ts
var _IOFBF: number;
```

## "quickjs:std".\_IOLBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/libc.md#filesetvbuf-method). Declares that the buffer mode should be 'line buffering'.

```ts
var _IOLBF: number;
```

## "quickjs:std".\_IONBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/libc.md#filesetvbuf-method). Declares that the buffer mode should be 'no buffering'.

```ts
var _IONBF: number;
```

## "quickjs:std".getenv (exported function)

Return the value of the environment variable `name` or `undefined` if it is not defined.

```ts
function getenv(name: string): string | undefined;
```

## "quickjs:std".setenv (exported function)

Set the value of the environment variable `name` to the string `value`.

```ts
function setenv(name: string, value: string): void;
```

## "quickjs:std".unsetenv (exported function)

Delete the environment variable `name`.

```ts
function unsetenv(name: string): void;
```

## "quickjs:std".getenviron (exported function)

Return an object containing the environment variables as key-value pairs.

```ts
function getenviron(): {
  [key: string]: string | undefined;
};
```

## "quickjs:std".getuid (exported function)

Return the real user ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
function getuid(): number;
```

## "quickjs:std".geteuid (exported function)

Return the effective user ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
function geteuid(): number;
```

## "quickjs:std".getgid (exported function)

Return the real group ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
function getgid(): number;
```

## "quickjs:std".getegid (exported function)

Return the effective group ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
function getegid(): number;
```

## "quickjs:std".UrlGet (interface)

```ts
interface UrlGet {
  (url: string): string;
  (
    url: string,
    options: {
      binary: false;
    },
  ): string;
  (
    url: string,
    options: {
      full: false;
    },
  ): string;
  (
    url: string,
    options: {
      binary: false;
      full: false;
    },
  ): string;
  (
    url: string,
    options: {
      binary: true;
    },
  ): ArrayBuffer;
  (
    url: string,
    options: {
      binary: true;
      full: false;
    },
  ): ArrayBuffer;
  (
    url: string,
    options: {
      full: true;
    },
  ): {
    status: number;
    response: string;
    responseHeaders: string;
  };
  (
    url: string,
    options: {
      full: true;
      binary: false;
    },
  ): {
    status: number;
    response: string;
    responseHeaders: string;
  };
  (
    url: string,
    options: {
      full: true;
      binary: true;
    },
  ): {
    status: number;
    response: ArrayBuffer;
    responseHeaders: string;
  };
}
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns string
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string): string;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns string
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string, options: {
  binary: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns string
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string, options: {
  full: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns string
when the http status code is between 200 and 299, and throws otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string, options: {
  binary: false;
  full: false;
}): string;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns
ArrayBuffer when the http status code is between 200 and 299, and throws
otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string, options: {
  binary: true;
}): ArrayBuffer;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility. Returns
ArrayBuffer when the http status code is between 200 and 299, and throws
otherwise.

Pass an object with { full: true } as the second argument to get
response headers and status code.

```ts
(url: string, options: {
  binary: true;
  full: false;
}): ArrayBuffer;
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility.

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

```ts
(url: string, options: {
  full: true;
}): {
  status: number;
  response: string;
  responseHeaders: string;
};
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility.

Returns an object with three properties:

- `response`: response body content (string)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

```ts
(url: string, options: {
  full: true;
  binary: false;
}): {
  status: number;
  response: string;
  responseHeaders: string;
};
```

### UrlGet(...) (call signature)

Download `url` using the `curl` command line utility.

Returns an object with three properties:

- `response`: response body content (ArrayBuffer)
- `responseHeaders`: headers separated by CRLF (string)
- `status`: status code (number)

```ts
(url: string, options: {
  full: true;
  binary: true;
}): {
  status: number;
  response: ArrayBuffer;
  responseHeaders: string;
};
```

## "quickjs:std".urlGet (exported UrlGet)

```ts
var urlGet: UrlGet;
```

## "quickjs:std".parseExtJSON (exported function)

Parse `str` using a superset of JSON.parse. The following extensions are accepted:

- Single line and multiline comments
- unquoted properties (ASCII-only Javascript identifiers)
- trailing comma in array and object definitions
- single quoted strings
- `\f` and `\v` are accepted as space characters
- leading plus in numbers
- octal (0o prefix) and hexadecimal (0x prefix) numbers

```ts
function parseExtJSON(str: string): any;
```

## "quickjs:std".strftime (exported function)

A wrapper around the standard C [strftime](https://en.cppreference.com/w/c/chrono/strftime).
Formats a time/date into a format as specified by the user.

- `@param` _maxBytes_ — The number of bytes to allocate for the string that will be returned
- `@param` _format_ — Format string, using `%`-prefixed sequences as found in [this table](https://en.cppreference.com/w/c/chrono/strftime#Format_string).
- `@param` _time_ — The Date object (or unix timestamp, in ms) to render.

```ts
function strftime(
  maxBytes: number,
  format: string,
  time: Date | number,
): string;
```

# "quickjs:os" (namespace)

```ts
declare module "quickjs:os" {
  export function open(filename: string, flags: number, mode?: number): number;
  export var O_RDONLY: number;
  export var O_WRONLY: number;
  export var O_RDWR: number;
  export var O_APPEND: number;
  export var O_CREAT: number;
  export var O_EXCL: number;
  export var O_TRUNC: number;
  export var O_BINARY: number | undefined;
  export var O_TEXT: number | undefined;
  export function close(fd: number): void;
  interface OsSeek {
    (fd: number, offset: number, whence: number): number;
    (fd: number, offset: BigInt, whence: number): BigInt;
  }
  export var seek: OsSeek;
  export function read(
    fd: number,
    buffer: ArrayBuffer,
    offset: number,
    length: number,
  ): number;
  export function write(
    fd: number,
    buffer: ArrayBuffer,
    offset: number,
    length: number,
  ): number;
  export function isatty(fd: number): boolean;
  export function ttyGetWinSize(fd: number): null | [number, number];
  export function ttySetRaw(fd: number): void;
  export function remove(filename: string): void;
  export function rename(oldname: string, newname: string): void;
  export function realpath(path: string): string;
  export function getcwd(): string;
  export function chdir(path: string): void;
  export function mkdir(path: string, mode?: number): void;
  export type Stats = {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blocks: number;
    atime: number;
    mtime: number;
    ctime: number;
  };
  export function stat(path: string): Stats;
  export function lstat(path: string): Stats;
  export var S_IFMT: number;
  export var S_IFIFO: number;
  export var S_IFCHR: number;
  export var S_IFDIR: number;
  export var S_IFBLK: number;
  export var S_IFREG: number;
  export var S_IFSOCK: number | undefined;
  export var S_IFLNK: number | undefined;
  export var S_ISGID: number | undefined;
  export var S_ISUID: number | undefined;
  export var S_IRWXU: number;
  export var S_IRUSR: number;
  export var S_IWUSR: number;
  export var S_IXUSR: number;
  export var S_IRWXG: number;
  export var S_IRGRP: number;
  export var S_IWGRP: number;
  export var S_IXGRP: number;
  export var S_IRWXO: number;
  export var S_IROTH: number;
  export var S_IWOTH: number;
  export var S_IXOTH: number;
  export function utimes(path: string, atime: number, mtime: number): void;
  export function symlink(target: string, linkpath: string): void;
  export function readlink(path: string): string;
  export function readdir(path: string): Array<string>;
  export function setReadHandler(fd: number, func: null | (() => void)): void;
  export function setWriteHandler(fd: number, func: null | (() => void)): void;
  export function signal(
    signal: number,
    func: null | undefined | (() => void),
  ): void;
  export var SIGINT: number;
  export var SIGABRT: number;
  export var SIGFPE: number;
  export var SIGILL: number;
  export var SIGSEGV: number;
  export var SIGTERM: number;
  export var SIGQUIT: number | undefined;
  export var SIGPIPE: number | undefined;
  export var SIGALRM: number | undefined;
  export var SIGUSR1: number | undefined;
  export var SIGUSR2: number | undefined;
  export var SIGCHLD: number | undefined;
  export var SIGCONT: number | undefined;
  export var SIGSTOP: number | undefined;
  export var SIGTSTP: number | undefined;
  export var SIGTTIN: number | undefined;
  export var SIGTTOU: number | undefined;
  export function kill(pid: number, sig: number): void;
  export type ExecOptions = {
    block?: boolean;
    usePath?: boolean;
    file?: string;
    cwd?: string;
    stdin?: number;
    stdout?: number;
    stderr?: number;
    env?: {
      [key: string | number]: string | number | boolean;
    };
    uid?: number;
    gid?: number;
  };
  export function exec(args: Array<string>, options?: ExecOptions): number;
  export function waitpid(pid: number, options?: number): [number, number];
  export var WNOHANG: number;
  export var WUNTRACED: number;
  export function WEXITSTATUS(status: number): number;
  export function WTERMSIG(status: number): number;
  export function WSTOPSIG(status: number): number;
  export function WIFEXITED(status: number): boolean;
  export function WIFSIGNALED(status: number): boolean;
  export function WIFSTOPPED(status: number): boolean;
  export function WIFCONTINUED(status: number): boolean;
  export function dup(fd: number): number;
  export function dup2(oldfd: number, newfd: number): number;
  export function pipe(): [number, number];
  export function sleep(delay_ms: number): void;
  export type OSTimer = {
    [Symbol.toStringTag]: "OSTimer";
  };
  export function setTimeout(
    func: (...args: any) => any,
    delay: number,
  ): OSTimer;
  export function clearTimeout(handle: OSTimer): void;
  export var platform: "linux" | "darwin" | "win32" | "freebsd" | "js";
  export type StructuredClonable =
    | string
    | number
    | boolean
    | null
    | undefined
    | Boolean
    | String
    | Date
    | RegExp
    | ArrayBuffer
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array
    | DataView
    | Array<StructuredClonable>
    | SharedArrayBuffer
    | {
        [key: string | number]: StructuredClonable;
      };
  export class Worker {
    constructor(moduleFilename: string);
    static parent: Worker;
    postMessage(msg: StructuredClonable): void;
    onmessage: null | ((event: { data: StructuredClonable }) => void);
  }
  export var R_OK: number;
  export var W_OK: number;
  export var X_OK: number;
  export var F_OK: number;
  export function access(path: string, accessMode: number): void;
  export function execPath(): string;
  export function chmod(path: string, mode: number): void;
}
```

## "quickjs:os".open (exported function)

Open a file handle. Returns a number; the file descriptor.

- `@param` _filename_ — The path to the file to open.
- `@param` _flags_ — Numeric flags that set the mode to use when opening the file. See `os.O_*`
- `@param` _mode_ — Octal access mask. Defaults to 0o666.

```ts
function open(filename: string, flags: number, mode?: number): number;
```

## "quickjs:os".O_RDONLY (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_RDONLY: number;
```

## "quickjs:os".O_WRONLY (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_WRONLY: number;
```

## "quickjs:os".O_RDWR (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_RDWR: number;
```

## "quickjs:os".O_APPEND (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_APPEND: number;
```

## "quickjs:os".O_CREAT (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_CREAT: number;
```

## "quickjs:os".O_EXCL (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_EXCL: number;
```

## "quickjs:os".O_TRUNC (exported number)

POSIX open flag, used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

```ts
var O_TRUNC: number;
```

## "quickjs:os".O_BINARY (exported value)

Windows-specific open flag: open the file in binary mode (which is the default). Used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

NOTE: this property is only present on windows

```ts
var O_BINARY: number | undefined;
```

## "quickjs:os".O_TEXT (exported value)

Windows-specific open flag: open the file in text mode. The default is binary mode. Used in [open](/meta/generated-docs/libc.md#quickjsosopen-exported-function).

NOTE: this property is only present on windows

```ts
var O_TEXT: number | undefined;
```

## "quickjs:os".close (exported function)

Close the file with descriptor `fd`.

```ts
function close(fd: number): void;
```

## "quickjs:os".OsSeek (interface)

```ts
interface OsSeek {
  (fd: number, offset: number, whence: number): number;
  (fd: number, offset: BigInt, whence: number): BigInt;
}
```

### OsSeek(...) (call signature)

Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too.

```ts
(fd: number, offset: number, whence: number): number;
```

### OsSeek(...) (call signature)

Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too.

```ts
(fd: number, offset: BigInt, whence: number): BigInt;
```

## "quickjs:os".seek (exported OsSeek)

Seek in the file. Use `std.SEEK_*` for `whence`. `offset` is either a number or a bigint. If `offset` is a bigint, a bigint is returned too.

```ts
var seek: OsSeek;
```

## "quickjs:os".read (exported function)

Read `length` bytes from the file with descriptor `fd` to the ArrayBuffer `buffer` at byte position `offset`. Return the number of read bytes.

```ts
function read(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
): number;
```

## "quickjs:os".write (exported function)

Write `length` bytes to the file with descriptor `fd` from the ArrayBuffer `buffer` at byte position `offset`. Return the number of written bytes.

```ts
function write(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
): number;
```

## "quickjs:os".isatty (exported function)

Return `true` if the file opened with descriptor `fd` is a TTY (terminal).

```ts
function isatty(fd: number): boolean;
```

## "quickjs:os".ttyGetWinSize (exported function)

Return the TTY size as `[width, height]` or `null` if not available.

```ts
function ttyGetWinSize(fd: number): null | [number, number];
```

## "quickjs:os".ttySetRaw (exported function)

Set the TTY in raw mode.

```ts
function ttySetRaw(fd: number): void;
```

## "quickjs:os".remove (exported function)

Remove a file.

```ts
function remove(filename: string): void;
```

## "quickjs:os".rename (exported function)

Rename a file.

```ts
function rename(oldname: string, newname: string): void;
```

## "quickjs:os".realpath (exported function)

Return the canonicalized absolute pathname of `path`.

```ts
function realpath(path: string): string;
```

## "quickjs:os".getcwd (exported function)

Return the current working directory.

```ts
function getcwd(): string;
```

## "quickjs:os".chdir (exported function)

Change the current directory.

```ts
function chdir(path: string): void;
```

## "quickjs:os".mkdir (exported function)

Create a directory at `path`.

```ts
function mkdir(path: string, mode?: number): void;
```

## "quickjs:os".Stats (exported type)

```ts
type Stats = {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blocks: number;
  atime: number;
  mtime: number;
  ctime: number;
};
```

### Stats.dev (number property)

```ts
dev: number;
```

### Stats.ino (number property)

```ts
ino: number;
```

### Stats.mode (number property)

```ts
mode: number;
```

### Stats.nlink (number property)

```ts
nlink: number;
```

### Stats.uid (number property)

```ts
uid: number;
```

### Stats.gid (number property)

```ts
gid: number;
```

### Stats.rdev (number property)

```ts
rdev: number;
```

### Stats.size (number property)

```ts
size: number;
```

### Stats.blocks (number property)

```ts
blocks: number;
```

### Stats.atime (number property)

```ts
atime: number;
```

### Stats.mtime (number property)

```ts
mtime: number;
```

### Stats.ctime (number property)

```ts
ctime: number;
```

## "quickjs:os".stat (exported function)

Return a stats object with the following fields:

- `dev`
- `ino`
- `mode`
- `nlink`
- `uid`
- `gid`
- `rdev`
- `size`
- `blocks`
- `atime`
- `mtime`
- `ctime`

The times are specified in milliseconds since 1970. `lstat()` is the same as `stat()` except that it returns information about the link itself.

```ts
function stat(path: string): Stats;
```

## "quickjs:os".lstat (exported function)

Return a stats object with the following fields:

- `dev`
- `ino`
- `mode`
- `nlink`
- `uid`
- `gid`
- `rdev`
- `size`
- `blocks`
- `atime`
- `mtime`
- `ctime`

The times are specified in milliseconds since 1970. `lstat()` is the same as `stat()` except that it returns information about the link itself.

```ts
function lstat(path: string): Stats;
```

## "quickjs:os".S_IFMT (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Mask for getting type of file from mode.

```ts
var S_IFMT: number;
```

## "quickjs:os".S_IFIFO (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: named pipe (fifo)

```ts
var S_IFIFO: number;
```

## "quickjs:os".S_IFCHR (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: character special

```ts
var S_IFCHR: number;
```

## "quickjs:os".S_IFDIR (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: directory

```ts
var S_IFDIR: number;
```

## "quickjs:os".S_IFBLK (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: block special

```ts
var S_IFBLK: number;
```

## "quickjs:os".S_IFREG (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: regular

```ts
var S_IFREG: number;
```

## "quickjs:os".S_IFSOCK (exported value)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: socket

NOTE: this property is not present on windows

```ts
var S_IFSOCK: number | undefined;
```

## "quickjs:os".S_IFLNK (exported value)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

File type: symbolic link

NOTE: this property is not present on windows

```ts
var S_IFLNK: number | undefined;
```

## "quickjs:os".S_ISGID (exported value)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Flag: set group id on execution

NOTE: this property is not present on windows

```ts
var S_ISGID: number | undefined;
```

## "quickjs:os".S_ISUID (exported value)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Flag: set user id on execution

NOTE: this property is not present on windows

```ts
var S_ISUID: number | undefined;
```

## "quickjs:os".S_IRWXU (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Mask for getting RWX permissions for owner

```ts
var S_IRWXU: number;
```

## "quickjs:os".S_IRUSR (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: read for owner

```ts
var S_IRUSR: number;
```

## "quickjs:os".S_IWUSR (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: write for owner

```ts
var S_IWUSR: number;
```

## "quickjs:os".S_IXUSR (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: execute for owner

```ts
var S_IXUSR: number;
```

## "quickjs:os".S_IRWXG (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Mask for getting RWX permissions for group

```ts
var S_IRWXG: number;
```

## "quickjs:os".S_IRGRP (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: read for group

```ts
var S_IRGRP: number;
```

## "quickjs:os".S_IWGRP (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: write for group

```ts
var S_IWGRP: number;
```

## "quickjs:os".S_IXGRP (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: execute for group

```ts
var S_IXGRP: number;
```

## "quickjs:os".S_IRWXO (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Mask for getting RWX permissions for others

```ts
var S_IRWXO: number;
```

## "quickjs:os".S_IROTH (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: read for others

```ts
var S_IROTH: number;
```

## "quickjs:os".S_IWOTH (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: write for others

```ts
var S_IWOTH: number;
```

## "quickjs:os".S_IXOTH (exported number)

Constant to interpret the `mode` property returned by `stat()`. Has the same value as in the C system header `sys/stat.h`.

Permission: execute for others

```ts
var S_IXOTH: number;
```

## "quickjs:os".utimes (exported function)

Change the access and modification times of the file path.

The times are specified in milliseconds since 1970.

```ts
function utimes(path: string, atime: number, mtime: number): void;
```

## "quickjs:os".symlink (exported function)

Create a link at `linkpath` containing the string `target`.

```ts
function symlink(target: string, linkpath: string): void;
```

## "quickjs:os".readlink (exported function)

Return the link target.

```ts
function readlink(path: string): string;
```

## "quickjs:os".readdir (exported function)

Return an array of strings containing the filenames of the directory `path`.

```ts
function readdir(path: string): Array<string>;
```

## "quickjs:os".setReadHandler (exported function)

Add a read handler to the file with descriptor `fd`. `func` is called each time there is data pending for `fd`. A single read handler per file handle is supported. Use `func = null` to remove the handler.

```ts
function setReadHandler(fd: number, func: null | (() => void)): void;
```

## "quickjs:os".setWriteHandler (exported function)

Add a write handler to the file with descriptor `fd`. `func` is called each time data can be written to `fd`. A single write handler per file handle is supported. Use `func = null` to remove the handler.

```ts
function setWriteHandler(fd: number, func: null | (() => void)): void;
```

## "quickjs:os".signal (exported function)

Call the function `func` when the signal `signal` happens. Only a single handler per signal number is supported. Use `null` to set the default handler or `undefined` to ignore the signal. Signal handlers can only be defined in the main thread.

```ts
function signal(signal: number, func: null | undefined | (() => void)): void;
```

## "quickjs:os".SIGINT (exported number)

POSIX signal number.

```ts
var SIGINT: number;
```

## "quickjs:os".SIGABRT (exported number)

POSIX signal number.

```ts
var SIGABRT: number;
```

## "quickjs:os".SIGFPE (exported number)

POSIX signal number.

```ts
var SIGFPE: number;
```

## "quickjs:os".SIGILL (exported number)

POSIX signal number.

```ts
var SIGILL: number;
```

## "quickjs:os".SIGSEGV (exported number)

POSIX signal number.

```ts
var SIGSEGV: number;
```

## "quickjs:os".SIGTERM (exported number)

POSIX signal number.

```ts
var SIGTERM: number;
```

## "quickjs:os".SIGQUIT (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGQUIT: number | undefined;
```

## "quickjs:os".SIGPIPE (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGPIPE: number | undefined;
```

## "quickjs:os".SIGALRM (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGALRM: number | undefined;
```

## "quickjs:os".SIGUSR1 (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGUSR1: number | undefined;
```

## "quickjs:os".SIGUSR2 (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGUSR2: number | undefined;
```

## "quickjs:os".SIGCHLD (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGCHLD: number | undefined;
```

## "quickjs:os".SIGCONT (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGCONT: number | undefined;
```

## "quickjs:os".SIGSTOP (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGSTOP: number | undefined;
```

## "quickjs:os".SIGTSTP (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGTSTP: number | undefined;
```

## "quickjs:os".SIGTTIN (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGTTIN: number | undefined;
```

## "quickjs:os".SIGTTOU (exported value)

POSIX signal number. NOTE: this signal is not present on windows.

```ts
var SIGTTOU: number | undefined;
```

## "quickjs:os".kill (exported function)

Send the signal `sig` to the process `pid`. Use `os.SIG*` constants.

```ts
function kill(pid: number, sig: number): void;
```

## "quickjs:os".ExecOptions (exported type)

```ts
type ExecOptions = {
  block?: boolean;
  usePath?: boolean;
  file?: string;
  cwd?: string;
  stdin?: number;
  stdout?: number;
  stderr?: number;
  env?: {
    [key: string | number]: string | number | boolean;
  };
  uid?: number;
  gid?: number;
};
```

### ExecOptions.block (boolean property)

Boolean (default = true). If true, wait until the process is terminated. In this case, `exec` returns the exit code if positive or the negated signal number if the process was interrupted by a signal. If false, do not block and return the process id of the child.

```ts
block?: boolean;
```

### ExecOptions.usePath (boolean property)

Boolean (default = true). If true, the file is searched in the `PATH` environment variable.

```ts
usePath?: boolean;
```

### ExecOptions.file (string property)

String (default = `args[0]`). Set the file to be executed.

```ts
file?: string;
```

### ExecOptions.cwd (string property)

String. If present, set the working directory of the new process.

```ts
cwd?: string;
```

### ExecOptions.stdin (number property)

If present, set the file descriptor in the child for stdin.

```ts
stdin?: number;
```

### ExecOptions.stdout (number property)

If present, set the file descriptor in the child for stdout.

```ts
stdout?: number;
```

### ExecOptions.stderr (number property)

If present, set the file descriptor in the child for stderr.

```ts
stderr?: number;
```

### ExecOptions.env (object property)

Object. If present, set the process environment from the object key-value pairs. Otherwise use the same environment as the current process. To get the current process's environment variables as on object, use `std.getenviron()`.

```ts
env?: {
  [key: string | number]: string | number | boolean;
};
```

### ExecOptions.uid (number property)

Integer. If present, the process uid with `setuid`.

```ts
uid?: number;
```

### ExecOptions.gid (number property)

Integer. If present, the process gid with `setgid`.

```ts
gid?: number;
```

## "quickjs:os".exec (exported function)

Execute a process with the arguments args, and the provided options (if any).

```ts
function exec(args: Array<string>, options?: ExecOptions): number;
```

## "quickjs:os".waitpid (exported function)

`waitpid` Unix system call. Returns the array [ret, status].

From man waitpid(2):

waitpid(): on success, returns the process ID of the child whose state has changed; if WNOHANG was specified and one or more child(ren) specified by pid exist, but have not yet changed state, then 0 is returned.

```ts
function waitpid(pid: number, options?: number): [number, number];
```

## "quickjs:os".WNOHANG (exported number)

Constant for the `options` argument of `waitpid`.

```ts
var WNOHANG: number;
```

## "quickjs:os".WUNTRACED (exported number)

Constant for the `options` argument of `waitpid`.

```ts
var WUNTRACED: number;
```

## "quickjs:os".WEXITSTATUS (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WEXITSTATUS(status: number): number;
```

## "quickjs:os".WTERMSIG (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WTERMSIG(status: number): number;
```

## "quickjs:os".WSTOPSIG (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WSTOPSIG(status: number): number;
```

## "quickjs:os".WIFEXITED (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WIFEXITED(status: number): boolean;
```

## "quickjs:os".WIFSIGNALED (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WIFSIGNALED(status: number): boolean;
```

## "quickjs:os".WIFSTOPPED (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WIFSTOPPED(status: number): boolean;
```

## "quickjs:os".WIFCONTINUED (exported function)

Function to be used to interpret the 'status' return value of `waitpid`.

```ts
function WIFCONTINUED(status: number): boolean;
```

## "quickjs:os".dup (exported function)

`dup` Unix system call.

```ts
function dup(fd: number): number;
```

## "quickjs:os".dup2 (exported function)

`dup2` Unix system call.

```ts
function dup2(oldfd: number, newfd: number): number;
```

## "quickjs:os".pipe (exported function)

`pipe` Unix system call. Return two handles as `[read_fd, write_fd]`.

```ts
function pipe(): [number, number];
```

## "quickjs:os".sleep (exported function)

Sleep for `delay_ms` milliseconds.

```ts
function sleep(delay_ms: number): void;
```

## "quickjs:os".OSTimer (exported type)

```ts
type OSTimer = {
  [Symbol.toStringTag]: "OSTimer";
};
```

## "quickjs:os".setTimeout (exported function)

Call the function func after delay ms. Return a handle to the timer.

```ts
function setTimeout(func: (...args: any) => any, delay: number): OSTimer;
```

## "quickjs:os".clearTimeout (exported function)

Cancel a timer.

```ts
function clearTimeout(handle: OSTimer): void;
```

## "quickjs:os".platform (exported value)

Return a string representing the platform: "linux", "darwin", "win32", "freebsd", or "js" (emscripten).

```ts
var platform: "linux" | "darwin" | "win32" | "freebsd" | "js";
```

## "quickjs:os".StructuredClonable (exported type)

Things that can be put into Worker.postMessage.

NOTE: This is effectively the same stuff as supported by the structured
clone algorithm, but without support for Map/Set (not supported in
QuickJS yet).

```ts
type StructuredClonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Boolean
  | String
  | Date
  | RegExp
  | ArrayBuffer
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | DataView
  | Array<StructuredClonable>
  | SharedArrayBuffer
  | {
      [key: string | number]: StructuredClonable;
    };
```

## "quickjs:os".Worker (exported class)

```ts
class Worker {
  constructor(moduleFilename: string);
  static parent: Worker;
  postMessage(msg: StructuredClonable): void;
  onmessage: null | ((event: { data: StructuredClonable }) => void);
}
```

### Worker (constructor)

Constructor to create a new thread (worker) with an API close to the
`WebWorkers`. `moduleFilename` is a string specifying the module
filename which is executed in the newly created thread. As for
dynamically imported module, it is relative to the current script or
module path. Threads normally don’t share any data and communicate
between each other with messages. Nested workers are not supported.

```ts
constructor(moduleFilename: string);
```

### Worker.parent (static Worker property)

In the created worker, Worker.parent represents the parent worker and is
used to send or receive messages.

```ts
static parent: Worker;
```

### Worker.prototype.postMessage (method)

Send a message to the corresponding worker. msg is cloned in the
destination worker using an algorithm similar to the HTML structured
clone algorithm. SharedArrayBuffer are shared between workers.

Current limitations: Map and Set are not supported yet.

```ts
postMessage(msg: StructuredClonable): void;
```

### Worker.prototype.onmessage (property)

Set a function which is called each time a message is received. The
function is called with a single argument. It is an object with a data
property containing the received message. The thread is not terminated
if there is at least one non null onmessage handler.

```ts
onmessage: null | ((event: {
  data: StructuredClonable;
}) => void);
```

## "quickjs:os".R_OK (exported number)

constant for [access](/meta/generated-docs/libc.md#quickjsosaccess-exported-function)(); test for read permission.

```ts
var R_OK: number;
```

## "quickjs:os".W_OK (exported number)

constant for [access](/meta/generated-docs/libc.md#quickjsosaccess-exported-function)(); test for write permission.

```ts
var W_OK: number;
```

## "quickjs:os".X_OK (exported number)

constant for [access](/meta/generated-docs/libc.md#quickjsosaccess-exported-function)(); test for execute (search) permission.

```ts
var X_OK: number;
```

## "quickjs:os".F_OK (exported number)

constant for [access](/meta/generated-docs/libc.md#quickjsosaccess-exported-function)(); test for existence of file.

```ts
var F_OK: number;
```

## "quickjs:os".access (exported function)

`access` Unix system call; checks if a file is readable, writable, executable, and/or exists (use [R_OK](/meta/generated-docs/libc.md#quickjsosr_ok-exported-number), [W_OK](/meta/generated-docs/libc.md#quickjsosw_ok-exported-number), [X_OK](/meta/generated-docs/libc.md#quickjsosx_ok-exported-number), and/or [F_OK](/meta/generated-docs/libc.md#quickjsosf_ok-exported-number) for `accessMode`). Throws a descriptive error (with errno property) if the requested access is not available; otherwise, returns undefined.

```ts
function access(path: string, accessMode: number): void;
```

## "quickjs:os".execPath (exported function)

gets the path to the executable which is executing this JS code. might be a relative path or symlink.

```ts
function execPath(): string;
```

## "quickjs:os".chmod (exported function)

changes the access permission bits of the file at `path` using the octal number `mode`.

```ts
function chmod(path: string, mode: number): void;
```

# setTimeout (value)

```ts
var setTimeout: typeof import("quickjs:os").setTimeout;
```

# clearTimeout (value)

```ts
var clearTimeout: typeof import("quickjs:os").clearTimeout;
```
