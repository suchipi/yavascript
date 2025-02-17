# ChildProcess (interface)

A class which represents a child process. The process may or may not be running.

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
  pid: number | null;
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

## ChildProcess.pid (property)

```ts
pid: number | null;
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
    options?: ChildProcessOptions,
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
