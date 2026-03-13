- ["quickjs:cmdline" (namespace)](#quickjscmdline-namespace)
  - ["quickjs:cmdline".getScriptArgs (exported function)](#quickjscmdlinegetscriptargs-exported-function)
  - ["quickjs:cmdline".exit (exported function)](#quickjscmdlineexit-exported-function)
  - ["quickjs:cmdline".getExitCode (exported function)](#quickjscmdlinegetexitcode-exported-function)
  - ["quickjs:cmdline".setExitCode (exported function)](#quickjscmdlinesetexitcode-exported-function)
- [scriptArgs (value)](#scriptargs-value)

# "quickjs:cmdline" (namespace)

The `"quickjs:cmdline"` module provides access to command line arguments
and process exit code management.

It can be imported using either of these forms:

```js
import * as cmdline from "quickjs:cmdline";
import { scriptArgs, exit } from "quickjs:cmdline";
```

```ts
declare module "quickjs:cmdline" {
  export function getScriptArgs(): Array<string>;
  export function exit(exitCode?: number): never;
  export function getExitCode(): number;
  export function setExitCode(exitCode: number): void;
}
```

## "quickjs:cmdline".getScriptArgs (exported function)

Returns the command line arguments. The first element is the script name.

Note: The global `scriptArgs` variable is also available and is the
preferred way to access command line arguments.

```ts
export function getScriptArgs(): Array<string>;
```

## "quickjs:cmdline".exit (exported function)

Terminates the process with the given exit code.

If no exit code is provided, uses the value set by `setExitCode`, or 0 if
one hasn't been set.

```ts
export function exit(exitCode?: number): never;
```

## "quickjs:cmdline".getExitCode (exported function)

Gets the current exit code (as set by setExitCode or errors).

```ts
export function getExitCode(): number;
```

## "quickjs:cmdline".setExitCode (exported function)

Sets the exit code to be returned when the process exits. This does not
terminate the process; it only sets the code that will be returned when the
process eventually exits.

If a future `exit` call receives an exitCode argument, the value set by
setExitCode will be ignored.

```ts
export function setExitCode(exitCode: number): void;
```

# scriptArgs (value)

Provides the command line arguments. The first element is the script name.

This is a global variable that is set by the host environment.

```ts
var scriptArgs: Array<string>;
```
