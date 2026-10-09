---
hide_title: true
---
## ChildProcess (interface)

A class which represents a child process. The process may or may not be
running.

This class is the API used internally by the [exec](./exec.md#exec-interface) function to spawn child
processes.

Generally, you should not need to use the `ChildProcess` class directly, and
should use [exec](./exec.md#exec-interface) or [$](./exec.md#-function) instead. However, you may need to use it in some
special cases, like when specifying custom stdio for a process, or spawning a
non-blocking long-running process.

**Example**

```ts
const child = new ChildProcess(["echo", "hi"]);
child.start();
child.waitUntilComplete();
```

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

### ChildProcess.args (property)

The argv for the process. The first entry in this array is the program to
run.

**Example**

```ts
const child = new ChildProcess("echo hi there");
console.log(child.args);
```

```ts
args: Array<string>;
```

### ChildProcess.cwd (Path property)

The current working directory for the process.

**Example**

```ts
const child = new ChildProcess(["ls"], { cwd: "src" });
console.log(child.cwd.toString());
```

```ts
cwd: Path;
```

### ChildProcess.env (object property)

The environment variables for the process.

**Example**

```ts
const child = new ChildProcess(["printenv", "GREETING"]);
child.env.GREETING = "hello";
child.start();
child.waitUntilComplete();
```

```ts
env: {
  [key: string]: string;
};
```

### ChildProcess.stdio (object property)

The standard I/O streams for the process. Generally these are the same as
`std.in`, `std.out`, and `std.err`, but they can be customized to write
output elsewhere.

**Example**

```ts
const logFile = std.open("output.log", "w");
const child = new ChildProcess(["echo", "hi"]);
child.stdio.out = logFile;
child.stdio.err = logFile;
child.start();
child.waitUntilComplete();
logFile.close();
```

```ts
stdio: {
  in: FILE;
  out: FILE;
  err: FILE;
};
```

#### ChildProcess.stdio.in (FILE property)

Where the process reads stdin from

**Example**

```ts
const child = new ChildProcess(["cat"]);
child.stdio.in = std.open("notes.txt", "r");
child.start();
child.waitUntilComplete();
```

```ts
in: FILE;
```

#### ChildProcess.stdio.out (FILE property)

Where the process writes stdout to

**Example**

```ts
const child = new ChildProcess(["date"]);
child.stdio.out = std.open("date.txt", "w");
child.start();
child.waitUntilComplete();
```

```ts
out: FILE;
```

#### ChildProcess.stdio.err (FILE property)

Where the process writes stderr to

**Example**

```ts
const child = new ChildProcess(["ls", "does-not-exist"]);
child.stdio.err = std.open("errors.log", "w");
child.start();
child.waitUntilComplete();
```

```ts
err: FILE;
```

### ChildProcess.state (getter)

```ts
get state(): ChildProcessState;
```

### ChildProcess.pid (getter)

```ts
get pid(): number | null;
```

### ChildProcess.start (method)

Spawns the process and returns its pid (process id).

**Example**

```ts
const child = new ChildProcess(["sleep", "1"]);
const pid = child.start();
console.log(pid);
```

```ts
start(): number;
```

### ChildProcess.waitUntilComplete (method)

Blocks the calling thread until the process exits or is killed.

**Example**

```ts
const child = new ChildProcess(["sleep", "1"]);
child.start();
const { status, signal } = child.waitUntilComplete();
console.log(status, signal);
```

```ts
waitUntilComplete(): {
  status: number;
  signal: undefined;
} | {
  status: undefined;
  signal: number;
};
```

## ChildProcessState (type)

```ts
declare type ChildProcessState =
  | {
      id: "UNSTARTED";
    }
  | {
      id: "STARTED";
      pid: number;
    }
  | {
      id: "STOPPED";
      pid: number;
    }
  | {
      id: "CONTINUED";
      pid: number;
    }
  | {
      id: "EXITED";
      oldPid: number;
      status: number;
    }
  | {
      id: "SIGNALED";
      oldPid: number;
      signal: number;
    };
```

## ChildProcessOptions (type)

Options to be passed to the ChildProcess constructor. Their purposes and
types match the same-named properties found on the resulting ChildProcess.

**Example**

```ts
const options: ChildProcessOptions = {
  cwd: "src",
  env: { GREETING: "hello" },
};
const child = new ChildProcess(["printenv", "GREETING"], options);
```

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

### ChildProcessOptions.cwd (property)

The current working directory for the process.

**Example**

```ts
const child = new ChildProcess(["ls"], { cwd: "src" });
child.start();
child.waitUntilComplete();
```

```ts
cwd?: string | Path;
```

### ChildProcessOptions.env (object property)

The environment variables for the process.

**Example**

```ts
const child = new ChildProcess(["printenv", "GREETING"], {
  env: { GREETING: "hello" },
});
child.start();
child.waitUntilComplete();
```

```ts
env?: {
  [key: string]: string;
};
```

### ChildProcessOptions.stdio (object property)

The standard I/O streams for the process. Generally these are the same as
`std.in`, `std.out`, and `std.err`, but they can be customized to write
output elsewhere.

**Example**

```ts
const logFile = std.open("output.log", "w");
const child = new ChildProcess(["echo", "hi"], {
  stdio: { out: logFile, err: logFile },
});
child.start();
child.waitUntilComplete();
logFile.close();
```

```ts
stdio?: {
  in?: FILE;
  out?: FILE;
  err?: FILE;
};
```

#### ChildProcessOptions.stdio.in (FILE property)

Where the process reads stdin from

**Example**

```ts
const child = new ChildProcess(["cat"], {
  stdio: { in: std.open("notes.txt", "r") },
});
child.start();
child.waitUntilComplete();
```

```ts
in?: FILE;
```

#### ChildProcessOptions.stdio.out (FILE property)

Where the process writes stdout to

**Example**

```ts
const child = new ChildProcess(["date"], {
  stdio: { out: std.open("date.txt", "w") },
});
child.start();
child.waitUntilComplete();
```

```ts
out?: FILE;
```

#### ChildProcessOptions.stdio.err (FILE property)

Where the process writes stderr to

**Example**

```ts
const child = new ChildProcess(["ls", "does-not-exist"], {
  stdio: { err: std.open("errors.log", "w") },
});
child.start();
child.waitUntilComplete();
```

```ts
err?: FILE;
```

### ChildProcessOptions.logging (object property)

Options which control logging

**Example**

```ts
const child = new ChildProcess(["echo", "hi"], {
  logging: { trace: console.error },
});
```

```ts
logging?: {
  trace?: (...args: Array<any>) => void;
};
```

#### ChildProcessOptions.logging.trace (function property)

Optional trace function which, if present, will be called at various
times to provide information about the lifecycle of the process.

Defaults to the current value of [logger.trace](./logger.md#loggertrace-function-property). `logger.trace`
defaults to a function which writes to stderr.

**Example**

```ts
const child = new ChildProcess(["echo", "hi"], {
  logging: { trace: (...args) => console.error("[child]", ...args) },
});
child.start();
child.waitUntilComplete();
```

```ts
trace?: (...args: Array<any>) => void;
```

## ChildProcessConstructor (interface)

```ts
declare interface ChildProcessConstructor {
  new (
    args: string | Path | Array<string | number | Path>,
    options?: ChildProcessOptions,
  ): ChildProcess;
  readonly prototype: ChildProcess;
}
```

### ChildProcessConstructor new(...) (construct signature)

Construct a new ChildProcess.

- `@param` _args_ — The argv for the process. The first entry in this array is the program to run.
- `@param` _options_ — Options for the process (cwd, env, stdio, etc)

**Example**

```ts
const child = new ChildProcess(["ls", "-la"], { cwd: "src" });
child.start();
child.waitUntilComplete();
```

```ts
new (args: string | Path | Array<string | number | Path>, options?: ChildProcessOptions): ChildProcess;
```

### ChildProcessConstructor.prototype (readonly ChildProcess property)

```ts
readonly prototype: ChildProcess;
```

## ChildProcess (ChildProcessConstructor)

```ts
var ChildProcess: ChildProcessConstructor;
```
