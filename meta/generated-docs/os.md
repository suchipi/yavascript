- ["quickjs:os" (namespace)](#quickjsos-namespace)
  - ["quickjs:os".open (exported function)](#quickjsosopen-exported-function)
  - ["quickjs:os".O_RDONLY (exported number)](#quickjsoso_rdonly-exported-number)
  - ["quickjs:os".O_WRONLY (exported number)](#quickjsoso_wronly-exported-number)
  - ["quickjs:os".O_RDWR (exported number)](#quickjsoso_rdwr-exported-number)
  - ["quickjs:os".O_APPEND (exported number)](#quickjsoso_append-exported-number)
  - ["quickjs:os".O_CREAT (exported number)](#quickjsoso_creat-exported-number)
  - ["quickjs:os".O_EXCL (exported number)](#quickjsoso_excl-exported-number)
  - ["quickjs:os".O_TRUNC (exported number)](#quickjsoso_trunc-exported-number)
  - ["quickjs:os".O_BINARY (exported number)](#quickjsoso_binary-exported-number)
  - ["quickjs:os".O_TEXT (exported number)](#quickjsoso_text-exported-number)
  - ["quickjs:os".close (exported function)](#quickjsosclose-exported-function)
  - ["quickjs:os".OsSeek (interface)](#quickjsososseek-interface)
    - [OsSeek(...) (call signature)](#osseek-call-signature)
    - [OsSeek(...) (call signature)](#osseek-call-signature-1)
  - ["quickjs:os".seek (exported OsSeek)](#quickjsosseek-exported-osseek)
  - ["quickjs:os".read (exported function)](#quickjsosread-exported-function)
  - ["quickjs:os".write (exported function)](#quickjsoswrite-exported-function)
  - ["quickjs:os".isatty (exported function)](#quickjsosisatty-exported-function)
  - ["quickjs:os".ttyGetWinSize (exported function)](#quickjsosttygetwinsize-exported-function)
  - ["quickjs:os".ttySetRaw (exported function)](#quickjsosttysetraw-exported-function)
  - ["quickjs:os".remove (exported function)](#quickjsosremove-exported-function)
  - ["quickjs:os".rename (exported function)](#quickjsosrename-exported-function)
  - ["quickjs:os".realpath (exported function)](#quickjsosrealpath-exported-function)
  - ["quickjs:os".getcwd (exported function)](#quickjsosgetcwd-exported-function)
  - ["quickjs:os".chdir (exported function)](#quickjsoschdir-exported-function)
  - ["quickjs:os".mkdir (exported function)](#quickjsosmkdir-exported-function)
  - ["quickjs:os".readdir (exported function)](#quickjsosreaddir-exported-function)
  - ["quickjs:os".Stats (exported type)](#quickjsosstats-exported-type)
    - [Stats.dev (number property)](#statsdev-number-property)
    - [Stats.ino (number property)](#statsino-number-property)
    - [Stats.mode (number property)](#statsmode-number-property)
    - [Stats.nlink (number property)](#statsnlink-number-property)
    - [Stats.uid (number property)](#statsuid-number-property)
    - [Stats.gid (number property)](#statsgid-number-property)
    - [Stats.rdev (number property)](#statsrdev-number-property)
    - [Stats.size (number property)](#statssize-number-property)
    - [Stats.blocks (number property)](#statsblocks-number-property)
    - [Stats.atime (number property)](#statsatime-number-property)
    - [Stats.mtime (number property)](#statsmtime-number-property)
    - [Stats.ctime (number property)](#statsctime-number-property)
  - ["quickjs:os".stat (exported function)](#quickjsosstat-exported-function)
  - ["quickjs:os".lstat (exported function)](#quickjsoslstat-exported-function)
  - ["quickjs:os".S_IFMT (exported number)](#quickjsoss_ifmt-exported-number)
  - ["quickjs:os".S_IFIFO (exported number)](#quickjsoss_ififo-exported-number)
  - ["quickjs:os".S_IFCHR (exported number)](#quickjsoss_ifchr-exported-number)
  - ["quickjs:os".S_IFDIR (exported number)](#quickjsoss_ifdir-exported-number)
  - ["quickjs:os".S_IFBLK (exported number)](#quickjsoss_ifblk-exported-number)
  - ["quickjs:os".S_IFREG (exported number)](#quickjsoss_ifreg-exported-number)
  - ["quickjs:os".S_IFSOCK (exported number)](#quickjsoss_ifsock-exported-number)
  - ["quickjs:os".S_IFLNK (exported number)](#quickjsoss_iflnk-exported-number)
  - ["quickjs:os".S_ISGID (exported number)](#quickjsoss_isgid-exported-number)
  - ["quickjs:os".S_ISUID (exported number)](#quickjsoss_isuid-exported-number)
  - ["quickjs:os".S_IRWXU (exported number)](#quickjsoss_irwxu-exported-number)
  - ["quickjs:os".S_IRUSR (exported number)](#quickjsoss_irusr-exported-number)
  - ["quickjs:os".S_IWUSR (exported number)](#quickjsoss_iwusr-exported-number)
  - ["quickjs:os".S_IXUSR (exported number)](#quickjsoss_ixusr-exported-number)
  - ["quickjs:os".S_IRWXG (exported number)](#quickjsoss_irwxg-exported-number)
  - ["quickjs:os".S_IRGRP (exported number)](#quickjsoss_irgrp-exported-number)
  - ["quickjs:os".S_IWGRP (exported number)](#quickjsoss_iwgrp-exported-number)
  - ["quickjs:os".S_IXGRP (exported number)](#quickjsoss_ixgrp-exported-number)
  - ["quickjs:os".S_IRWXO (exported number)](#quickjsoss_irwxo-exported-number)
  - ["quickjs:os".S_IROTH (exported number)](#quickjsoss_iroth-exported-number)
  - ["quickjs:os".S_IWOTH (exported number)](#quickjsoss_iwoth-exported-number)
  - ["quickjs:os".S_IXOTH (exported number)](#quickjsoss_ixoth-exported-number)
  - ["quickjs:os".utimes (exported function)](#quickjsosutimes-exported-function)
  - ["quickjs:os".symlink (exported function)](#quickjsossymlink-exported-function)
  - ["quickjs:os".readlink (exported function)](#quickjsosreadlink-exported-function)
  - ["quickjs:os".setReadHandler (exported function)](#quickjsossetreadhandler-exported-function)
  - ["quickjs:os".setWriteHandler (exported function)](#quickjsossetwritehandler-exported-function)
  - ["quickjs:os".signal (exported function)](#quickjsossignal-exported-function)
  - ["quickjs:os".SIGINT (exported number)](#quickjsossigint-exported-number)
  - ["quickjs:os".SIGABRT (exported number)](#quickjsossigabrt-exported-number)
  - ["quickjs:os".SIGFPE (exported number)](#quickjsossigfpe-exported-number)
  - ["quickjs:os".SIGILL (exported number)](#quickjsossigill-exported-number)
  - ["quickjs:os".SIGSEGV (exported number)](#quickjsossigsegv-exported-number)
  - ["quickjs:os".SIGTERM (exported number)](#quickjsossigterm-exported-number)
  - ["quickjs:os".SIGQUIT (exported number)](#quickjsossigquit-exported-number)
  - ["quickjs:os".SIGPIPE (exported number)](#quickjsossigpipe-exported-number)
  - ["quickjs:os".SIGALRM (exported number)](#quickjsossigalrm-exported-number)
  - ["quickjs:os".SIGUSR1 (exported number)](#quickjsossigusr1-exported-number)
  - ["quickjs:os".SIGUSR2 (exported number)](#quickjsossigusr2-exported-number)
  - ["quickjs:os".SIGCHLD (exported number)](#quickjsossigchld-exported-number)
  - ["quickjs:os".SIGCONT (exported number)](#quickjsossigcont-exported-number)
  - ["quickjs:os".SIGSTOP (exported number)](#quickjsossigstop-exported-number)
  - ["quickjs:os".SIGTSTP (exported number)](#quickjsossigtstp-exported-number)
  - ["quickjs:os".SIGTTIN (exported number)](#quickjsossigttin-exported-number)
  - ["quickjs:os".SIGTTOU (exported number)](#quickjsossigttou-exported-number)
  - ["quickjs:os".kill (exported function)](#quickjsoskill-exported-function)
  - ["quickjs:os".ExecOptions (exported type)](#quickjsosexecoptions-exported-type)
    - [ExecOptions.block (boolean property)](#execoptionsblock-boolean-property)
    - [ExecOptions.usePath (boolean property)](#execoptionsusepath-boolean-property)
    - [ExecOptions.file (string property)](#execoptionsfile-string-property)
    - [ExecOptions.cwd (string property)](#execoptionscwd-string-property)
    - [ExecOptions.stdin (property)](#execoptionsstdin-property)
    - [ExecOptions.stdout (property)](#execoptionsstdout-property)
    - [ExecOptions.stderr (property)](#execoptionsstderr-property)
    - [ExecOptions.env (object property)](#execoptionsenv-object-property)
    - [ExecOptions.uid (number property)](#execoptionsuid-number-property)
    - [ExecOptions.gid (number property)](#execoptionsgid-number-property)
  - ["quickjs:os".exec (exported function)](#quickjsosexec-exported-function)
  - ["quickjs:os".getpid (exported function)](#quickjsosgetpid-exported-function)
  - ["quickjs:os".waitpid (exported function)](#quickjsoswaitpid-exported-function)
  - ["quickjs:os".WNOHANG (exported number)](#quickjsoswnohang-exported-number)
  - ["quickjs:os".WUNTRACED (exported number)](#quickjsoswuntraced-exported-number)
  - ["quickjs:os".WEXITSTATUS (exported function)](#quickjsoswexitstatus-exported-function)
  - ["quickjs:os".WTERMSIG (exported function)](#quickjsoswtermsig-exported-function)
  - ["quickjs:os".WSTOPSIG (exported function)](#quickjsoswstopsig-exported-function)
  - ["quickjs:os".WIFEXITED (exported function)](#quickjsoswifexited-exported-function)
  - ["quickjs:os".WIFSIGNALED (exported function)](#quickjsoswifsignaled-exported-function)
  - ["quickjs:os".WIFSTOPPED (exported function)](#quickjsoswifstopped-exported-function)
  - ["quickjs:os".WIFCONTINUED (exported function)](#quickjsoswifcontinued-exported-function)
  - ["quickjs:os".dup (exported function)](#quickjsosdup-exported-function)
  - ["quickjs:os".dup2 (exported function)](#quickjsosdup2-exported-function)
  - ["quickjs:os".pipe (exported function)](#quickjsospipe-exported-function)
  - ["quickjs:os".sleep (exported function)](#quickjsossleep-exported-function)
  - ["quickjs:os".now (exported function)](#quickjsosnow-exported-function)
  - ["quickjs:os".platform (exported value)](#quickjsosplatform-exported-value)
  - ["quickjs:os".StructuredClonable (exported type)](#quickjsosstructuredclonable-exported-type)
  - ["quickjs:os".Worker (exported class)](#quickjsosworker-exported-class)
    - [Worker (constructor)](#worker-constructor)
    - [Worker.parent (static Worker property)](#workerparent-static-worker-property)
    - [Worker.prototype.postMessage (method)](#workerprototypepostmessage-method)
    - [Worker.prototype.terminate (method)](#workerprototypeterminate-method)
    - [Worker.prototype.onmessage (property)](#workerprototypeonmessage-property)
    - [Worker.prototype.onerror (property)](#workerprototypeonerror-property)
  - ["quickjs:os".Win32Handle (exported class)](#quickjsoswin32handle-exported-class)
    - [Win32Handle (constructor)](#win32handle-constructor)
  - ["quickjs:os".CreateProcessOptions (exported type)](#quickjsoscreateprocessoptions-exported-type)
    - [CreateProcessOptions.moduleName (string property)](#createprocessoptionsmodulename-string-property)
    - [CreateProcessOptions.flags (number property)](#createprocessoptionsflags-number-property)
    - [CreateProcessOptions.cwd (string property)](#createprocessoptionscwd-string-property)
    - [CreateProcessOptions.env (object property)](#createprocessoptionsenv-object-property)
    - [CreateProcessOptions.stdin (property)](#createprocessoptionsstdin-property)
    - [CreateProcessOptions.stdout (property)](#createprocessoptionsstdout-property)
    - [CreateProcessOptions.stderr (property)](#createprocessoptionsstderr-property)
  - ["quickjs:os".CreateProcessResult (exported type)](#quickjsoscreateprocessresult-exported-type)
    - [CreateProcessResult.pid (number property)](#createprocessresultpid-number-property)
    - [CreateProcessResult.processHandle (Win32Handle property)](#createprocessresultprocesshandle-win32handle-property)
    - [CreateProcessResult.tid (number property)](#createprocessresulttid-number-property)
    - [CreateProcessResult.threadHandle (Win32Handle property)](#createprocessresultthreadhandle-win32handle-property)
  - ["quickjs:os".CreateProcess (exported value)](#quickjsoscreateprocess-exported-value)
  - ["quickjs:os".WaitForSingleObject (exported value)](#quickjsoswaitforsingleobject-exported-value)
  - ["quickjs:os".GetExitCodeProcess (exported value)](#quickjsosgetexitcodeprocess-exported-value)
  - ["quickjs:os".TerminateProcess (exported value)](#quickjsosterminateprocess-exported-value)
  - ["quickjs:os".CloseHandle (exported value)](#quickjsosclosehandle-exported-value)
  - ["quickjs:os".CreatePipeOptions (exported type)](#quickjsoscreatepipeoptions-exported-type)
    - [CreatePipeOptions.inheritHandle (boolean property)](#createpipeoptionsinherithandle-boolean-property)
  - ["quickjs:os".CreatePipeResult (exported type)](#quickjsoscreatepiperesult-exported-type)
    - [CreatePipeResult.readEnd (FILE property)](#createpiperesultreadend-file-property)
    - [CreatePipeResult.writeEnd (FILE property)](#createpiperesultwriteend-file-property)
  - ["quickjs:os".CreatePipe (exported value)](#quickjsoscreatepipe-exported-value)
  - ["quickjs:os".WAIT_OBJECT_0 (exported value)](#quickjsoswait_object_0-exported-value)
  - ["quickjs:os".WAIT_ABANDONED (exported value)](#quickjsoswait_abandoned-exported-value)
  - ["quickjs:os".WAIT_TIMEOUT (exported value)](#quickjsoswait_timeout-exported-value)
  - ["quickjs:os".WAIT_FAILED (exported value)](#quickjsoswait_failed-exported-value)
  - ["quickjs:os".R_OK (exported number)](#quickjsosr_ok-exported-number)
  - ["quickjs:os".W_OK (exported number)](#quickjsosw_ok-exported-number)
  - ["quickjs:os".X_OK (exported number)](#quickjsosx_ok-exported-number)
  - ["quickjs:os".F_OK (exported number)](#quickjsosf_ok-exported-number)
  - ["quickjs:os".access (exported function)](#quickjsosaccess-exported-function)
  - ["quickjs:os".execPath (exported function)](#quickjsosexecpath-exported-function)
  - ["quickjs:os".chmod (exported function)](#quickjsoschmod-exported-function)
  - ["quickjs:os".gethostname (exported function)](#quickjsosgethostname-exported-function)

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
  export var O_BINARY: number;
  export var O_TEXT: number;
  export function close(fd: number): void;
  interface OsSeek {
    (fd: number, offset: number, whence: number): number;
    (fd: number, offset: bigint, whence: number): bigint;
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
  export function readdir(path: string): Array<string>;
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
  export var S_IFSOCK: number;
  export var S_IFLNK: number;
  export var S_ISGID: number;
  export var S_ISUID: number;
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
  export var SIGQUIT: number;
  export var SIGPIPE: number;
  export var SIGALRM: number;
  export var SIGUSR1: number;
  export var SIGUSR2: number;
  export var SIGCHLD: number;
  export var SIGCONT: number;
  export var SIGSTOP: number;
  export var SIGTSTP: number;
  export var SIGTTIN: number;
  export var SIGTTOU: number;
  export function kill(pid: number, sig: number): void;
  export type ExecOptions = {
    block?: boolean;
    usePath?: boolean;
    file?: string;
    cwd?: string;
    stdin?: number | FILE;
    stdout?: number | FILE;
    stderr?: number | FILE;
    env?: {
      [key: string | number]: string | number | boolean;
    };
    uid?: number;
    gid?: number;
  };
  export function exec(args: Array<string>, options?: ExecOptions): number;
  export function getpid(): number;
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
  export function now(): number;
  export var platform:
    | "win32"
    | "darwin"
    | "emscripten"
    | "wasm"
    | "freebsd"
    | "linux"
    | "unknown";
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
    terminate(): void;
    onmessage: null | ((event: { data: StructuredClonable }) => void);
    onerror:
      | null
      | ((event: {
          message: string;
          filename: string;
          lineno: number;
          error: Error | null;
        }) => void);
  }
  export class Win32Handle {
    private constructor();
    readonly [Symbol.toStringTag]: "Win32Handle";
  }
  export type CreateProcessOptions = {
    moduleName?: string;
    flags?: number;
    cwd?: string;
    env?: {
      [key: string]: string;
    };
    stdin?: FILE | number;
    stdout?: FILE | number;
    stderr?: FILE | number;
  };
  export type CreateProcessResult = {
    pid: number;
    processHandle: Win32Handle;
    tid: number;
    threadHandle: Win32Handle;
  };
  export var CreateProcess:
    | undefined
    | ((
        commandLine: string | null,
        options?: CreateProcessOptions,
      ) => CreateProcessResult);
  export var WaitForSingleObject:
    | undefined
    | ((handle: Win32Handle, timeoutMs?: number) => number);
  export var GetExitCodeProcess: undefined | ((handle: Win32Handle) => number);
  export var TerminateProcess:
    | undefined
    | ((handle: Win32Handle, exitCode: number) => void);
  export var CloseHandle: undefined | ((handle: Win32Handle) => void);
  export type CreatePipeOptions = {
    inheritHandle?: boolean;
  };
  export type CreatePipeResult = {
    readEnd: FILE;
    writeEnd: FILE;
  };
  export var CreatePipe:
    | undefined
    | ((options?: CreatePipeOptions) => CreatePipeResult);
  export var WAIT_OBJECT_0: number | undefined;
  export var WAIT_ABANDONED: number | undefined;
  export var WAIT_TIMEOUT: number | undefined;
  export var WAIT_FAILED: number | undefined;
  export var R_OK: number;
  export var W_OK: number;
  export var X_OK: number;
  export var F_OK: number;
  export function access(path: string, accessMode: number): void;
  export function execPath(): string;
  export function chmod(path: string, mode: number): void;
  export function gethostname(): string;
}
```

## "quickjs:os".open (exported function)

Open a file handle. Returns a number; the file descriptor.

- `@param` _filename_ — The path to the file to open.
- `@param` _flags_ — Numeric flags that set the mode to use when opening the file. See `os.O_*`
- `@param` _mode_ — Octal access mask. Defaults to 0o666.

```ts
export function open(filename: string, flags: number, mode?: number): number;
```

## "quickjs:os".O_RDONLY (exported number)

POSIX open flag, used in [open](/meta/generated-docs/os.md#quickjsosopen-exported-function).

```ts
var O_RDONLY: number;
```

## "quickjs:os".O_WRONLY (exported number)

```ts
var O_WRONLY: number;
```

## "quickjs:os".O_RDWR (exported number)

```ts
var O_RDWR: number;
```

## "quickjs:os".O_APPEND (exported number)

```ts
var O_APPEND: number;
```

## "quickjs:os".O_CREAT (exported number)

```ts
var O_CREAT: number;
```

## "quickjs:os".O_EXCL (exported number)

```ts
var O_EXCL: number;
```

## "quickjs:os".O_TRUNC (exported number)

```ts
var O_TRUNC: number;
```

## "quickjs:os".O_BINARY (exported number)

```ts
var O_BINARY: number;
```

## "quickjs:os".O_TEXT (exported number)

```ts
var O_TEXT: number;
```

## "quickjs:os".close (exported function)

Close the file with descriptor `fd`.

```ts
export function close(fd: number): void;
```

## "quickjs:os".OsSeek (interface)

```ts
interface OsSeek {
  (fd: number, offset: number, whence: number): number;
  (fd: number, offset: bigint, whence: number): bigint;
}
```

### OsSeek(...) (call signature)

```ts
(fd: number, offset: number, whence: number): number;
```

### OsSeek(...) (call signature)

```ts
(fd: number, offset: bigint, whence: number): bigint;
```

## "quickjs:os".seek (exported OsSeek)

```ts
var seek: OsSeek;
```

## "quickjs:os".read (exported function)

```ts
export function read(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
): number;
```

## "quickjs:os".write (exported function)

```ts
export function write(
  fd: number,
  buffer: ArrayBuffer,
  offset: number,
  length: number,
): number;
```

## "quickjs:os".isatty (exported function)

```ts
export function isatty(fd: number): boolean;
```

## "quickjs:os".ttyGetWinSize (exported function)

```ts
export function ttyGetWinSize(fd: number): null | [number, number];
```

## "quickjs:os".ttySetRaw (exported function)

```ts
export function ttySetRaw(fd: number): void;
```

## "quickjs:os".remove (exported function)

```ts
export function remove(filename: string): void;
```

## "quickjs:os".rename (exported function)

```ts
export function rename(oldname: string, newname: string): void;
```

## "quickjs:os".realpath (exported function)

```ts
export function realpath(path: string): string;
```

## "quickjs:os".getcwd (exported function)

```ts
export function getcwd(): string;
```

## "quickjs:os".chdir (exported function)

```ts
export function chdir(path: string): void;
```

## "quickjs:os".mkdir (exported function)

```ts
export function mkdir(path: string, mode?: number): void;
```

## "quickjs:os".readdir (exported function)

```ts
export function readdir(path: string): Array<string>;
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

```ts
export function stat(path: string): Stats;
```

## "quickjs:os".lstat (exported function)

```ts
export function lstat(path: string): Stats;
```

## "quickjs:os".S_IFMT (exported number)

```ts
var S_IFMT: number;
```

## "quickjs:os".S_IFIFO (exported number)

```ts
var S_IFIFO: number;
```

## "quickjs:os".S_IFCHR (exported number)

```ts
var S_IFCHR: number;
```

## "quickjs:os".S_IFDIR (exported number)

```ts
var S_IFDIR: number;
```

## "quickjs:os".S_IFBLK (exported number)

```ts
var S_IFBLK: number;
```

## "quickjs:os".S_IFREG (exported number)

```ts
var S_IFREG: number;
```

## "quickjs:os".S_IFSOCK (exported number)

```ts
var S_IFSOCK: number;
```

## "quickjs:os".S_IFLNK (exported number)

```ts
var S_IFLNK: number;
```

## "quickjs:os".S_ISGID (exported number)

```ts
var S_ISGID: number;
```

## "quickjs:os".S_ISUID (exported number)

```ts
var S_ISUID: number;
```

## "quickjs:os".S_IRWXU (exported number)

```ts
var S_IRWXU: number;
```

## "quickjs:os".S_IRUSR (exported number)

```ts
var S_IRUSR: number;
```

## "quickjs:os".S_IWUSR (exported number)

```ts
var S_IWUSR: number;
```

## "quickjs:os".S_IXUSR (exported number)

```ts
var S_IXUSR: number;
```

## "quickjs:os".S_IRWXG (exported number)

```ts
var S_IRWXG: number;
```

## "quickjs:os".S_IRGRP (exported number)

```ts
var S_IRGRP: number;
```

## "quickjs:os".S_IWGRP (exported number)

```ts
var S_IWGRP: number;
```

## "quickjs:os".S_IXGRP (exported number)

```ts
var S_IXGRP: number;
```

## "quickjs:os".S_IRWXO (exported number)

```ts
var S_IRWXO: number;
```

## "quickjs:os".S_IROTH (exported number)

```ts
var S_IROTH: number;
```

## "quickjs:os".S_IWOTH (exported number)

```ts
var S_IWOTH: number;
```

## "quickjs:os".S_IXOTH (exported number)

```ts
var S_IXOTH: number;
```

## "quickjs:os".utimes (exported function)

```ts
export function utimes(path: string, atime: number, mtime: number): void;
```

## "quickjs:os".symlink (exported function)

```ts
export function symlink(target: string, linkpath: string): void;
```

## "quickjs:os".readlink (exported function)

```ts
export function readlink(path: string): string;
```

## "quickjs:os".setReadHandler (exported function)

```ts
export function setReadHandler(fd: number, func: null | (() => void)): void;
```

## "quickjs:os".setWriteHandler (exported function)

```ts
export function setWriteHandler(fd: number, func: null | (() => void)): void;
```

## "quickjs:os".signal (exported function)

```ts
export function signal(
  signal: number,
  func: null | undefined | (() => void),
): void;
```

## "quickjs:os".SIGINT (exported number)

```ts
var SIGINT: number;
```

## "quickjs:os".SIGABRT (exported number)

```ts
var SIGABRT: number;
```

## "quickjs:os".SIGFPE (exported number)

```ts
var SIGFPE: number;
```

## "quickjs:os".SIGILL (exported number)

```ts
var SIGILL: number;
```

## "quickjs:os".SIGSEGV (exported number)

```ts
var SIGSEGV: number;
```

## "quickjs:os".SIGTERM (exported number)

```ts
var SIGTERM: number;
```

## "quickjs:os".SIGQUIT (exported number)

```ts
var SIGQUIT: number;
```

## "quickjs:os".SIGPIPE (exported number)

```ts
var SIGPIPE: number;
```

## "quickjs:os".SIGALRM (exported number)

```ts
var SIGALRM: number;
```

## "quickjs:os".SIGUSR1 (exported number)

```ts
var SIGUSR1: number;
```

## "quickjs:os".SIGUSR2 (exported number)

```ts
var SIGUSR2: number;
```

## "quickjs:os".SIGCHLD (exported number)

```ts
var SIGCHLD: number;
```

## "quickjs:os".SIGCONT (exported number)

```ts
var SIGCONT: number;
```

## "quickjs:os".SIGSTOP (exported number)

```ts
var SIGSTOP: number;
```

## "quickjs:os".SIGTSTP (exported number)

```ts
var SIGTSTP: number;
```

## "quickjs:os".SIGTTIN (exported number)

```ts
var SIGTTIN: number;
```

## "quickjs:os".SIGTTOU (exported number)

```ts
var SIGTTOU: number;
```

## "quickjs:os".kill (exported function)

```ts
export function kill(pid: number, sig: number): void;
```

## "quickjs:os".ExecOptions (exported type)

```ts
type ExecOptions = {
  block?: boolean;
  usePath?: boolean;
  file?: string;
  cwd?: string;
  stdin?: number | FILE;
  stdout?: number | FILE;
  stderr?: number | FILE;
  env?: {
    [key: string | number]: string | number | boolean;
  };
  uid?: number;
  gid?: number;
};
```

### ExecOptions.block (boolean property)

```ts
block?: boolean;
```

### ExecOptions.usePath (boolean property)

```ts
usePath?: boolean;
```

### ExecOptions.file (string property)

```ts
file?: string;
```

### ExecOptions.cwd (string property)

```ts
cwd?: string;
```

### ExecOptions.stdin (property)

```ts
stdin?: number | FILE;
```

### ExecOptions.stdout (property)

```ts
stdout?: number | FILE;
```

### ExecOptions.stderr (property)

```ts
stderr?: number | FILE;
```

### ExecOptions.env (object property)

```ts
env?: {
  [key: string | number]: string | number | boolean;
};
```

### ExecOptions.uid (number property)

```ts
uid?: number;
```

### ExecOptions.gid (number property)

```ts
gid?: number;
```

## "quickjs:os".exec (exported function)

```ts
export function exec(args: Array<string>, options?: ExecOptions): number;
```

## "quickjs:os".getpid (exported function)

Return the current process ID.

```ts
export function getpid(): number;
```

## "quickjs:os".waitpid (exported function)

```ts
export function waitpid(pid: number, options?: number): [number, number];
```

## "quickjs:os".WNOHANG (exported number)

```ts
var WNOHANG: number;
```

## "quickjs:os".WUNTRACED (exported number)

```ts
var WUNTRACED: number;
```

## "quickjs:os".WEXITSTATUS (exported function)

```ts
export function WEXITSTATUS(status: number): number;
```

## "quickjs:os".WTERMSIG (exported function)

```ts
export function WTERMSIG(status: number): number;
```

## "quickjs:os".WSTOPSIG (exported function)

```ts
export function WSTOPSIG(status: number): number;
```

## "quickjs:os".WIFEXITED (exported function)

```ts
export function WIFEXITED(status: number): boolean;
```

## "quickjs:os".WIFSIGNALED (exported function)

```ts
export function WIFSIGNALED(status: number): boolean;
```

## "quickjs:os".WIFSTOPPED (exported function)

```ts
export function WIFSTOPPED(status: number): boolean;
```

## "quickjs:os".WIFCONTINUED (exported function)

```ts
export function WIFCONTINUED(status: number): boolean;
```

## "quickjs:os".dup (exported function)

```ts
export function dup(fd: number): number;
```

## "quickjs:os".dup2 (exported function)

```ts
export function dup2(oldfd: number, newfd: number): number;
```

## "quickjs:os".pipe (exported function)

```ts
export function pipe(): [number, number];
```

## "quickjs:os".sleep (exported function)

```ts
export function sleep(delay_ms: number): void;
```

## "quickjs:os".now (exported function)

Return a timestamp in milliseconds with more precision than
`Date.now()`. The time origin is unspecified and is normally not
impacted by system clock adjustments.

```ts
export function now(): number;
```

## "quickjs:os".platform (exported value)

```ts
var platform:
  | "win32"
  | "darwin"
  | "emscripten"
  | "wasm"
  | "freebsd"
  | "linux"
  | "unknown";
```

## "quickjs:os".StructuredClonable (exported type)

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
  terminate(): void;
  onmessage: null | ((event: { data: StructuredClonable }) => void);
  onerror:
    | null
    | ((event: {
        message: string;
        filename: string;
        lineno: number;
        error: Error | null;
      }) => void);
}
```

### Worker (constructor)

```ts
constructor(moduleFilename: string);
```

### Worker.parent (static Worker property)

```ts
static parent: Worker;
```

### Worker.prototype.postMessage (method)

```ts
postMessage(msg: StructuredClonable): void;
```

### Worker.prototype.terminate (method)

Terminate the worker thread. Equivalent to setting `onmessage` to `null`.

```ts
terminate(): void;
```

### Worker.prototype.onmessage (property)

```ts
onmessage: null | ((event: {
  data: StructuredClonable;
}) => void);
```

### Worker.prototype.onerror (property)

Fires on the parent side whenever an uncaught exception escapes
anywhere in the worker: top-level errors at startup, the worker's
global `onmessage` throwing, timer / I/O / signal callbacks
throwing, microtask rejections, and unhandled promise rejections.

The event is a plain object shaped like a WHATWG `ErrorEvent`
(minus `colno`, which this event does not surface):

- `message` — the error's message, or `String(reason)` for a
  non-Error throw.
- `filename` — from the error's `fileName` own-prop when present,
  otherwise the worker's entry-module filename.
- `lineno` — from the error's `lineNumber` own-prop, otherwise `0`.
- `error` — a real `Error` instance when the worker threw an
  Error (one of the nine recognized classes: `Error`, `TypeError`,
  `RangeError`, `SyntaxError`, `ReferenceError`, `URIError`,
  `EvalError`, `AggregateError`, `InternalError`, with user
  subclasses reified to base `Error` with `.name` preserved).
  `null` when the thrown value was not an Error.

Cycles and shared references in the error graph (e.g.
`err.cause === err`, or shared nodes inside
`AggregateError.errors[]`) are preserved, matching the HTML
structured-clone algorithm.

A handler assigned same-tick as `new Worker(...)` is guaranteed
to be in place before any error dispatch: the parent's event
loop cannot drain and dispatch error-pipe messages until the
current synchronous tick finishes, and the error-port
registration (on which dispatch is gated) happens synchronously
in the Worker ctor. Cross-tick late assignment (`setTimeout(() =>
w.onerror = fn, 100)`) is still racy with any error that fires
before the timeout — such errors fall through to the stderr
fallback. When `onerror` is unset, errors print to stderr in the
same format as an uncaught exception would.

```ts
onerror: null | ((event: {
  message: string;
  filename: string;
  lineno: number;
  error: Error | null;
}) => void);
```

## "quickjs:os".Win32Handle (exported class)

An opaque wrapper around a Win32 HANDLE.

Win32Handle objects cannot be created directly from JavaScript code.
They are created by native functions like [CreateProcess](/meta/generated-docs/os.md#quickjsoscreateprocess-exported-value).

On non-Windows platforms, this class exists but no instances will ever
be created.

```ts
class Win32Handle {
  private constructor();
  readonly [Symbol.toStringTag]: "Win32Handle";
}
```

### Win32Handle (constructor)

```ts
private constructor();
```

## "quickjs:os".CreateProcessOptions (exported type)

```ts
type CreateProcessOptions = {
  moduleName?: string;
  flags?: number;
  cwd?: string;
  env?: {
    [key: string]: string;
  };
  stdin?: FILE | number;
  stdout?: FILE | number;
  stderr?: FILE | number;
};
```

### CreateProcessOptions.moduleName (string property)

The name of the module to be executed (maps to lpApplicationName).

```ts
moduleName?: string;
```

### CreateProcessOptions.flags (number property)

Process creation flags (maps to dwCreationFlags).

```ts
flags?: number;
```

### CreateProcessOptions.cwd (string property)

The working directory of the new process.

```ts
cwd?: string;
```

### CreateProcessOptions.env (object property)

Environment variables for the new process. If not specified, the parent's environment is inherited. Values must be strings.

```ts
env?: {
  [key: string]: string;
};
```

### CreateProcessOptions.stdin (property)

FILE object or file descriptor number to use for the child's stdin.

```ts
stdin?: FILE | number;
```

### CreateProcessOptions.stdout (property)

FILE object or file descriptor number to use for the child's stdout.

```ts
stdout?: FILE | number;
```

### CreateProcessOptions.stderr (property)

FILE object or file descriptor number to use for the child's stderr.

```ts
stderr?: FILE | number;
```

## "quickjs:os".CreateProcessResult (exported type)

```ts
type CreateProcessResult = {
  pid: number;
  processHandle: Win32Handle;
  tid: number;
  threadHandle: Win32Handle;
};
```

### CreateProcessResult.pid (number property)

The process ID of the newly created process.

```ts
pid: number;
```

### CreateProcessResult.processHandle (Win32Handle property)

A Win32Handle for the process.

```ts
processHandle: Win32Handle;
```

### CreateProcessResult.tid (number property)

The thread ID of the primary thread of the newly created process.

```ts
tid: number;
```

### CreateProcessResult.threadHandle (Win32Handle property)

A Win32Handle for the primary thread.

```ts
threadHandle: Win32Handle;
```

## "quickjs:os".CreateProcess (exported value)

Create a new process using the Win32 `CreateProcessW` API.

- `@param` _commandLine_ — The command line to execute.
- `@param` _options_ — Optional settings for module name, flags, cwd, env, and stdio redirection.
- `@returns` An object with `pid`, `processHandle`, `tid`, and `threadHandle`.

NOTE: this function is only present on windows

```ts
var CreateProcess:
  | undefined
  | ((
      commandLine: string | null,
      options?: CreateProcessOptions,
    ) => CreateProcessResult);
```

## "quickjs:os".WaitForSingleObject (exported value)

Wait for a Win32 handle to be signaled (wrapper for Win32 `WaitForSingleObject`).

- `@param` _handle_ — The handle to wait on.
- `@param` _timeoutMs_ — Timeout in milliseconds. Defaults to `Infinity` (INFINITE). Pass `Infinity` to wait indefinitely.
- `@returns` One of the `WAIT_*` constants.

NOTE: this function is only present on windows

```ts
var WaitForSingleObject:
  | undefined
  | ((handle: Win32Handle, timeoutMs?: number) => number);
```

## "quickjs:os".GetExitCodeProcess (exported value)

Retrieve the exit code of a process (wrapper for Win32 `GetExitCodeProcess`).

- `@param` _handle_ — A process handle.
- `@returns` The exit code of the process.

NOTE: this function is only present on windows

```ts
var GetExitCodeProcess: undefined | ((handle: Win32Handle) => number);
```

## "quickjs:os".TerminateProcess (exported value)

Terminate a process (wrapper for Win32 `TerminateProcess`).

- `@param` _handle_ — A process handle.
- `@param` _exitCode_ — The exit code to assign to the process.

NOTE: this function is only present on windows

```ts
var TerminateProcess:
  | undefined
  | ((handle: Win32Handle, exitCode: number) => void);
```

## "quickjs:os".CloseHandle (exported value)

Close a Win32 handle. The handle will automatically be closed when the
Win32Handle object is garbage-collected, but it's safe to close it
yourself as well; a handle that has already been closed will not be
closed again during garbage collection.

- `@param` _handle_ — The handle to close.

NOTE: this function is only present on windows

```ts
var CloseHandle: undefined | ((handle: Win32Handle) => void);
```

## "quickjs:os".CreatePipeOptions (exported type)

```ts
type CreatePipeOptions = {
  inheritHandle?: boolean;
};
```

### CreatePipeOptions.inheritHandle (boolean property)

Whether the pipe handles should be inheritable. Defaults to true.

```ts
inheritHandle?: boolean;
```

## "quickjs:os".CreatePipeResult (exported type)

```ts
type CreatePipeResult = {
  readEnd: FILE;
  writeEnd: FILE;
};
```

### CreatePipeResult.readEnd (FILE property)

The read end of the pipe (a FILE object opened in binary read mode).

```ts
readEnd: FILE;
```

### CreatePipeResult.writeEnd (FILE property)

The write end of the pipe (a FILE object opened in binary write mode).

```ts
writeEnd: FILE;
```

## "quickjs:os".CreatePipe (exported value)

Create an anonymous pipe (wrapper for Win32 `CreatePipe`).

Returns FILE objects for both ends of the pipe. The read end is opened in
binary read mode ("rb") and the write end in binary write mode ("wb").
You can use all standard FILE methods (readAsString, getline, puts, write,
read, close, etc.) on the returned objects.

- `@param` _options_ — Optional settings. `inheritHandle` defaults to true.
- `@returns` An object with `readEnd` and `writeEnd` FILE properties.

NOTE: this function is only present on windows

```ts
var CreatePipe: undefined | ((options?: CreatePipeOptions) => CreatePipeResult);
```

## "quickjs:os".WAIT_OBJECT_0 (exported value)

Win32 wait result constant: the object was signaled.

NOTE: this property is only present on windows

```ts
var WAIT_OBJECT_0: number | undefined;
```

## "quickjs:os".WAIT_ABANDONED (exported value)

Win32 wait result constant: the object was an abandoned mutex.

NOTE: this property is only present on windows

```ts
var WAIT_ABANDONED: number | undefined;
```

## "quickjs:os".WAIT_TIMEOUT (exported value)

Win32 wait result constant: the wait timed out.

NOTE: this property is only present on windows

```ts
var WAIT_TIMEOUT: number | undefined;
```

## "quickjs:os".WAIT_FAILED (exported value)

Win32 wait result constant: the function call failed.

NOTE: this property is only present on windows

```ts
var WAIT_FAILED: number | undefined;
```

## "quickjs:os".R_OK (exported number)

```ts
var R_OK: number;
```

## "quickjs:os".W_OK (exported number)

```ts
var W_OK: number;
```

## "quickjs:os".X_OK (exported number)

```ts
var X_OK: number;
```

## "quickjs:os".F_OK (exported number)

```ts
var F_OK: number;
```

## "quickjs:os".access (exported function)

```ts
export function access(path: string, accessMode: number): void;
```

## "quickjs:os".execPath (exported function)

```ts
export function execPath(): string;
```

## "quickjs:os".chmod (exported function)

```ts
export function chmod(path: string, mode: number): void;
```

## "quickjs:os".gethostname (exported function)

```ts
export function gethostname(): string;
```
