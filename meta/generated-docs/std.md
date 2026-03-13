- [FILE (interface)](#file-interface)
  - [FILE.target (property)](#filetarget-property)
  - [FILE.close (method)](#fileclose-method)
  - [FILE.puts (method)](#fileputs-method)
  - [FILE.printf (method)](#fileprintf-method)
  - [FILE.flush (method)](#fileflush-method)
  - [FILE.sync (method)](#filesync-method)
  - [FILE.seek (method)](#fileseek-method)
  - [FILE.tell (method)](#filetell-method)
  - [FILE.tello (method)](#filetello-method)
  - [FILE.eof (method)](#fileeof-method)
  - [FILE.fileno (method)](#filefileno-method)
  - [FILE.read (method)](#fileread-method)
  - [FILE.write (method)](#filewrite-method)
  - [FILE.writeTo (method)](#filewriteto-method)
  - [FILE.getline (method)](#filegetline-method)
  - [FILE.readAsString (method)](#filereadasstring-method)
  - [FILE.getByte (method)](#filegetbyte-method)
  - [FILE.putByte (method)](#fileputbyte-method)
  - [FILE.setvbuf (method)](#filesetvbuf-method)
- ["quickjs:std" (namespace)](#quickjsstd-namespace)
  - ["quickjs:std".loadFile (exported function)](#quickjsstdloadfile-exported-function)
  - ["quickjs:std".isFILE (exported function)](#quickjsstdisfile-exported-function)
  - ["quickjs:std".open (exported function)](#quickjsstdopen-exported-function)
  - ["quickjs:std".popen (exported function)](#quickjsstdpopen-exported-function)
  - ["quickjs:std".fdopen (exported function)](#quickjsstdfdopen-exported-function)
  - ["quickjs:std".tmpfile (exported function)](#quickjsstdtmpfile-exported-function)
  - ["quickjs:std".puts (exported function)](#quickjsstdputs-exported-function)
  - ["quickjs:std".printf (exported function)](#quickjsstdprintf-exported-function)
  - ["quickjs:std".sprintf (exported function)](#quickjsstdsprintf-exported-function)
  - ["quickjs:std".in (exported FILE)](#quickjsstdin-exported-file)
  - ["quickjs:std".in (exported binding)](#quickjsstdin-exported-binding)
  - ["quickjs:std".out (exported FILE)](#quickjsstdout-exported-file)
  - ["quickjs:std".err (exported FILE)](#quickjsstderr-exported-file)
  - ["quickjs:std".SEEK_SET (exported number)](#quickjsstdseek_set-exported-number)
  - ["quickjs:std".SEEK_CUR (exported number)](#quickjsstdseek_cur-exported-number)
  - ["quickjs:std".SEEK_END (exported number)](#quickjsstdseek_end-exported-number)
  - ["quickjs:std".\_IOFBF (exported number)](#quickjsstd_iofbf-exported-number)
  - ["quickjs:std".\_IOLBF (exported number)](#quickjsstd_iolbf-exported-number)
  - ["quickjs:std".\_IONBF (exported number)](#quickjsstd_ionbf-exported-number)
  - ["quickjs:std".getenv (exported function)](#quickjsstdgetenv-exported-function)
  - ["quickjs:std".setenv (exported function)](#quickjsstdsetenv-exported-function)
  - ["quickjs:std".unsetenv (exported function)](#quickjsstdunsetenv-exported-function)
  - ["quickjs:std".getenviron (exported function)](#quickjsstdgetenviron-exported-function)
  - ["quickjs:std".getuid (exported function)](#quickjsstdgetuid-exported-function)
  - ["quickjs:std".geteuid (exported function)](#quickjsstdgeteuid-exported-function)
  - ["quickjs:std".getgid (exported function)](#quickjsstdgetgid-exported-function)
  - ["quickjs:std".getegid (exported function)](#quickjsstdgetegid-exported-function)
  - ["quickjs:std".PasswdEntry (exported interface)](#quickjsstdpasswdentry-exported-interface)
    - [PasswdEntry.name (string property)](#passwdentryname-string-property)
    - [PasswdEntry.passwd (string property)](#passwdentrypasswd-string-property)
    - [PasswdEntry.uid (number property)](#passwdentryuid-number-property)
    - [PasswdEntry.gid (number property)](#passwdentrygid-number-property)
    - [PasswdEntry.gecos (string property)](#passwdentrygecos-string-property)
    - [PasswdEntry.dir (string property)](#passwdentrydir-string-property)
    - [PasswdEntry.shell (string property)](#passwdentryshell-string-property)
  - ["quickjs:std".getpwuid (exported function)](#quickjsstdgetpwuid-exported-function)
  - ["quickjs:std".UrlGet (interface)](#quickjsstdurlget-interface)
    - [UrlGet(...) (call signature)](#urlget-call-signature)
    - [UrlGet(...) (call signature)](#urlget-call-signature-1)
    - [UrlGet(...) (call signature)](#urlget-call-signature-2)
    - [UrlGet(...) (call signature)](#urlget-call-signature-3)
    - [UrlGet(...) (call signature)](#urlget-call-signature-4)
    - [UrlGet(...) (call signature)](#urlget-call-signature-5)
    - [UrlGet(...) (call signature)](#urlget-call-signature-6)
    - [UrlGet(...) (call signature)](#urlget-call-signature-7)
    - [UrlGet(...) (call signature)](#urlget-call-signature-8)
  - ["quickjs:std".urlGet (exported UrlGet)](#quickjsstdurlget-exported-urlget)
  - ["quickjs:std".parseExtJSON (exported function)](#quickjsstdparseextjson-exported-function)
  - ["quickjs:std".strftime (exported function)](#quickjsstdstrftime-exported-function)

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
  seek(offset: number | bigint, whence: number): void;
  tell(): number;
  tello(): bigint;
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
upgrading QuickJS or yavascript, even if upgrading by a minor or patch
release.

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
seek(offset: number | bigint, whence: number): void;
```

## FILE.tell (method)

Return the current file position.

```ts
tell(): number;
```

## FILE.tello (method)

Return the current file position as a bigint.

```ts
tello(): bigint;
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
  export interface PasswdEntry {
    name: string;
    passwd: string;
    uid: number;
    gid: number;
    gecos: string;
    dir: string;
    shell: string;
  }
  export function getpwuid(id: number): PasswdEntry;
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

## "quickjs:std".loadFile (exported function)

Load the file `filename` and return it as a string assuming UTF-8 encoding.

- `@param` _filename_ — The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.

```ts
export function loadFile(filename: string): string;
```

## "quickjs:std".isFILE (exported function)

Return a boolean indicating whether the provided value is a FILE object.

- `@param` _value_ — The value to check.
- `@returns` Whether the value was a `FILE` or not.

```ts
export function isFILE(value: any): boolean;
```

## "quickjs:std".open (exported function)

Open a file (wrapper to the libc `fopen()`).
Return the FILE object.

- `@param` _filename_ — The relative or absolute path to the file to open. Relative paths are resolved relative to the process's current working directory.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
export function open(filename: string, flags: string): FILE;
```

## "quickjs:std".popen (exported function)

Open a process by creating a pipe (wrapper to the libc `popen()`).
Return the FILE object.

- `@param` _command_ — The command line to execute. Gets passed via `/bin/sh -c`.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
export function popen(command: string, flags: string): FILE;
```

## "quickjs:std".fdopen (exported function)

Open a file from a file handle (wrapper to the libc `fdopen()`).
Return the FILE object.

- `@param` _fd_ — The file handle to open.
- `@param` _flags_ — A string containing any combination of the characters 'r', 'w', 'a', '+', and/or 'b'.
- `@returns` The opened FILE object.

```ts
export function fdopen(fd: number, flags: string): FILE;
```

## "quickjs:std".tmpfile (exported function)

Open a temporary file.
Return the FILE object.

- `@returns` The opened FILE object.

```ts
export function tmpfile(): FILE;
```

## "quickjs:std".puts (exported function)

Equivalent to `std.out.puts(str)`.

```ts
export function puts(...strings: Array<string>): void;
```

## "quickjs:std".printf (exported function)

Equivalent to `std.out.printf(fmt, ...args)`

```ts
export function printf(fmt: string, ...args: Array<any>): void;
```

## "quickjs:std".sprintf (exported function)

Equivalent to the libc sprintf().

```ts
export function sprintf(fmt: string, ...args: Array<any>): void;
```

## "quickjs:std".in (exported FILE)

Wrapper to the libc file stdin.

```ts
var in_: FILE;
```

## "quickjs:std".in (exported binding)

```ts
export { in_ as in };
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

Constant for [FILE.seek](/meta/generated-docs/std.md#fileseek-method). Declares that pointer offset should be relative to the beginning of the file. See also libc `fseek()`.

```ts
var SEEK_SET: number;
```

## "quickjs:std".SEEK_CUR (exported number)

Constant for [FILE.seek](/meta/generated-docs/std.md#fileseek-method). Declares that the offset should be relative to the current position of the FILE handle. See also libc `fseek()`.

```ts
var SEEK_CUR: number;
```

## "quickjs:std".SEEK_END (exported number)

Constant for [FILE.seek](/meta/generated-docs/std.md#fileseek-method). Declares that the offset should be relative to the end of the file. See also libc `fseek()`.

```ts
var SEEK_END: number;
```

## "quickjs:std".\_IOFBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/std.md#filesetvbuf-method). Declares that the buffer mode should be 'full buffering'.

```ts
var _IOFBF: number;
```

## "quickjs:std".\_IOLBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/std.md#filesetvbuf-method). Declares that the buffer mode should be 'line buffering'.

```ts
var _IOLBF: number;
```

## "quickjs:std".\_IONBF (exported number)

Constant for [FILE.setvbuf](/meta/generated-docs/std.md#filesetvbuf-method). Declares that the buffer mode should be 'no buffering'.

```ts
var _IONBF: number;
```

## "quickjs:std".getenv (exported function)

Return the value of the environment variable `name` or `undefined` if it is not defined.

```ts
export function getenv(name: string): string | undefined;
```

## "quickjs:std".setenv (exported function)

Set the value of the environment variable `name` to the string `value`.

```ts
export function setenv(name: string, value: string): void;
```

## "quickjs:std".unsetenv (exported function)

Delete the environment variable `name`.

```ts
export function unsetenv(name: string): void;
```

## "quickjs:std".getenviron (exported function)

Return an object containing the environment variables as key-value pairs.

```ts
export function getenviron(): {
  [key: string]: string | undefined;
};
```

## "quickjs:std".getuid (exported function)

Return the real user ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
export function getuid(): number;
```

## "quickjs:std".geteuid (exported function)

Return the effective user ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
export function geteuid(): number;
```

## "quickjs:std".getgid (exported function)

Return the real group ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
export function getgid(): number;
```

## "quickjs:std".getegid (exported function)

Return the effective group ID of the calling process.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
export function getegid(): number;
```

## "quickjs:std".PasswdEntry (exported interface)

The type of the object returned by [getpwuid](/meta/generated-docs/std.md#quickjsstdgetpwuid-exported-function).

```ts
interface PasswdEntry {
  name: string;
  passwd: string;
  uid: number;
  gid: number;
  gecos: string;
  dir: string;
  shell: string;
}
```

### PasswdEntry.name (string property)

```ts
name: string;
```

### PasswdEntry.passwd (string property)

```ts
passwd: string;
```

### PasswdEntry.uid (number property)

```ts
uid: number;
```

### PasswdEntry.gid (number property)

```ts
gid: number;
```

### PasswdEntry.gecos (string property)

```ts
gecos: string;
```

### PasswdEntry.dir (string property)

```ts
dir: string;
```

### PasswdEntry.shell (string property)

```ts
shell: string;
```

## "quickjs:std".getpwuid (exported function)

Get information from the passwd file entry for the specified user id.

See https://linux.die.net/man/3/getpwuid.

This function throws an error on windows, because windows doesn't support
the same uid/gid paradigm as Unix-like operating systems.

```ts
export function getpwuid(id: number): PasswdEntry;
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
export function parseExtJSON(str: string): any;
```

## "quickjs:std".strftime (exported function)

A wrapper around the standard C [strftime](https://en.cppreference.com/w/c/chrono/strftime).
Formats a time/date into a format as specified by the user.

- `@param` _maxBytes_ — The number of bytes to allocate for the string that will be returned
- `@param` _format_ — Format string, using `%`-prefixed sequences as found in [this table](https://en.cppreference.com/w/c/chrono/strftime#Format_string).
- `@param` _time_ — The Date object (or unix timestamp, in ms) to render.

```ts
export function strftime(
  maxBytes: number,
  format: string,
  time: Date | number,
): string;
```
