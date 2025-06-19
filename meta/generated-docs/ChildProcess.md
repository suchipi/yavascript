- [ChildProcess (interface)](#childprocess-interface)
  - [ChildProcess.args (property)](#childprocessargs-property)
  - [ChildProcess.cwd (Path property)](#childprocesscwd-path-property)
  - [ChildProcess.env (object property)](#childprocessenv-object-property)
  - [ChildProcess.stdio (object property)](#childprocessstdio-object-property)
    - [ChildProcess.stdio.in (FILE property)](#childprocessstdioin-file-property)
    - [ChildProcess.stdio.out (FILE property)](#childprocessstdioout-file-property)
    - [ChildProcess.stdio.err (FILE property)](#childprocessstdioerr-file-property)
  - [ChildProcess.state (getter)](#childprocessstate-getter)
  - [ChildProcess.pid (getter)](#childprocesspid-getter)
  - [ChildProcess.start (method)](#childprocessstart-method)
  - [ChildProcess.waitUntilComplete (method)](#childprocesswaituntilcomplete-method)
- [ChildProcessState (type)](#childprocessstate-type)
- [ChildProcessOptions (type)](#childprocessoptions-type)
  - [ChildProcessOptions.cwd (property)](#childprocessoptionscwd-property)
  - [ChildProcessOptions.env (object property)](#childprocessoptionsenv-object-property)
  - [ChildProcessOptions.stdio (object property)](#childprocessoptionsstdio-object-property)
    - [ChildProcessOptions.stdio.in (FILE property)](#childprocessoptionsstdioin-file-property)
    - [ChildProcessOptions.stdio.out (FILE property)](#childprocessoptionsstdioout-file-property)
    - [ChildProcessOptions.stdio.err (FILE property)](#childprocessoptionsstdioerr-file-property)
  - [ChildProcessOptions.logging (object property)](#childprocessoptionslogging-object-property)
    - [ChildProcessOptions.logging.trace (function property)](#childprocessoptionsloggingtrace-function-property)
- [ChildProcessConstructor (interface)](#childprocessconstructor-interface)
  - [ChildProcessConstructor new(...) (construct signature)](#childprocessconstructor-new-construct-signature)
  - [ChildProcessConstructor.prototype (ChildProcess property)](#childprocessconstructorprototype-childprocess-property)
- [ChildProcess (ChildProcessConstructor)](#childprocess-childprocessconstructor)

# ChildProcess (interface)

A class which represents a child process. The process may or may not be
running.

This class is the API used internally by the [exec](/meta/generated-docs/exec.md#exec-interface) function to spawn child
processes.

Generally, you should not need to use the `ChildProcess` class directly, and
should use [exec](/meta/generated-docs/exec.md#exec-interface) or [$](/meta/generated-docs/exec.md#-function) instead. However, you may need to use it in some
special cases, like when specifying custom stdio for a process, or spawning a
non-blocking long-running process.

```ts
declare interface ChildProcess {
  args: Array<string>;
  cwd: Path;
  env: {
    [key: string]: string;
  };
  stdio: {
    in: FILE;
    out: FILE;
    err: FILE;
  };
  get state(): ChildProcessState;
  get pid(): number | null;
  start(): number;
  waitUntilComplete():
    | {
        status: number;
        signal: undefined;
      }
    | {
        status: undefined;
        signal: number;
      };
}
```

## ChildProcess.args (property)

The argv for the process. The first entry in this array is the program to
run.

```ts
args: Array<string>;
```

## ChildProcess.cwd (Path property)

The current working directory for the process.

```ts
cwd: Path;
```

## ChildProcess.env (object property)

The environment variables for the process.

```ts
env: {
  [key: string]: string;
};
```

## ChildProcess.stdio (object property)

The standard I/O streams for the process. Generally these are the same as
`std.in`, `std.out`, and `std.err`, but they can be customized to write
output elsewhere.

```ts
stdio: {
  in: FILE;
  out: FILE;
  err: FILE;
};
```

### ChildProcess.stdio.in (FILE property)

Where the process reads stdin from

```ts
in: FILE;
```

### ChildProcess.stdio.out (FILE property)

Where the process writes stdout to

```ts
out: FILE;
```

### ChildProcess.stdio.err (FILE property)

Where the process writes stderr to

```ts
err: FILE;
```

## ChildProcess.state (getter)

```ts
get state(): ChildProcessState;
```

## ChildProcess.pid (getter)

```ts
get pid(): number | null;
```

## ChildProcess.start (method)

Spawns the process and returns its pid (process id).

```ts
start(): number;
```

## ChildProcess.waitUntilComplete (method)

Blocks the calling thread until the process exits or is killed.

```ts
waitUntilComplete(): {
  status: number;
  signal: undefined;
} | {
  status: undefined;
  signal: number;
};
```

# ChildProcessState (type)

```ts
declare type ChildProcessState =
  | {
      id: ChildProcessStateKind.UNSTARTED;
    }
  | {
      id: ChildProcessStateKind.STARTED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.STOPPED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.CONTINUED;
      pid: number;
    }
  | {
      id: ChildProcessStateKind.EXITED;
      oldPid: number;
      status: number;
    }
  | {
      id: ChildProcessStateKind.SIGNALED;
      oldPid: number;
      signal: number;
    };
```

# ChildProcessOptions (type)

Options to be passed to the ChildProcess constructor. Their purposes and
types match the same-named properties found on the resulting ChildProcess.

```ts
declare type ChildProcessOptions = {
  cwd?: string | Path;
  env?: {
    [key: string]: string;
  };
  stdio?: {
    in?: FILE;
    out?: FILE;
    err?: FILE;
  };
  logging?: {
    trace?: (...args: Array<any>) => void;
  };
};
```

## ChildProcessOptions.cwd (property)

The current working directory for the process.

```ts
cwd?: string | Path;
```

## ChildProcessOptions.env (object property)

The environment variables for the process.

```ts
env?: {
  [key: string]: string;
};
```

## ChildProcessOptions.stdio (object property)

The standard I/O streams for the process. Generally these are the same as
`std.in`, `std.out`, and `std.err`, but they can be customized to write
output elsewhere.

```ts
stdio?: {
  in?: FILE;
  out?: FILE;
  err?: FILE;
};
```

### ChildProcessOptions.stdio.in (FILE property)

Where the process reads stdin from

```ts
in?: FILE;
```

### ChildProcessOptions.stdio.out (FILE property)

Where the process writes stdout to

```ts
out?: FILE;
```

### ChildProcessOptions.stdio.err (FILE property)

Where the process writes stderr to

```ts
err?: FILE;
```

## ChildProcessOptions.logging (object property)

Options which control logging

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
};
```

### ChildProcessOptions.logging.trace (function property)

Optional trace function which, if present, will be called at various
times to provide information about the lifecycle of the process.

Defaults to the current value of [logger.trace](/meta/generated-docs/logger.md#loggertrace-function-property). `logger.trace`
defaults to a function which writes to stderr.

```ts
trace?: (...args: Array<any>) => void;
```

# ChildProcessConstructor (interface)

```ts
declare interface ChildProcessConstructor {
  new (
    args: string | Path | Array<string | number | Path>,
    options?: ChildProcessOptions
  ): ChildProcess;
  readonly prototype: ChildProcess;
}
```

## ChildProcessConstructor new(...) (construct signature)

Construct a new ChildProcess.

- `@param` _args_ — The argv for the process. The first entry in this array is the program to run.
- `@param` _options_ — Options for the process (cwd, env, stdio, etc)

```ts
new (args: string | Path | Array<string | number | Path>, options?: ChildProcessOptions): ChildProcess;
```

## ChildProcessConstructor.prototype (ChildProcess property)

```ts
readonly prototype: ChildProcess;
```

# ChildProcess (ChildProcessConstructor)

```ts
var ChildProcess: ChildProcessConstructor;
```
