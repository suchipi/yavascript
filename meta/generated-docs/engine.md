- ["quickjs:engine" (namespace)](#quickjsengine-namespace)
  - ["quickjs:engine".isMainModule (exported function)](#quickjsengineismainmodule-exported-function)
  - ["quickjs:engine".setMainModule (exported function)](#quickjsenginesetmainmodule-exported-function)
  - ["quickjs:engine".evalScript (exported function)](#quickjsengineevalscript-exported-function)
  - ["quickjs:engine".runScript (exported function)](#quickjsenginerunscript-exported-function)
  - ["quickjs:engine".importModule (exported function)](#quickjsengineimportmodule-exported-function)
  - ["quickjs:engine".resolveModule (exported function)](#quickjsengineresolvemodule-exported-function)
  - ["quickjs:engine".getFileNameFromStack (exported function)](#quickjsenginegetfilenamefromstack-exported-function)
  - ["quickjs:engine".isModuleNamespace (exported function)](#quickjsengineismodulenamespace-exported-function)
  - ["quickjs:engine".defineBuiltinModule (exported function)](#quickjsenginedefinebuiltinmodule-exported-function)
  - ["quickjs:engine".ModuleDelegate (exported ModuleDelegate)](#quickjsenginemoduledelegate-exported-moduledelegate)
  - ["quickjs:engine".gc (exported function)](#quickjsenginegc-exported-function)
  - ["quickjs:engine".StackFrameMapper (exported type)](#quickjsenginestackframemapper-exported-type)
  - ["quickjs:engine".setStackFrameMapper (exported function)](#quickjsenginesetstackframemapper-exported-function)
  - ["quickjs:engine".getStackFrameMapper (exported function)](#quickjsenginegetstackframemapper-exported-function)
  - ["quickjs:engine".formatValue (exported function)](#quickjsengineformatvalue-exported-function)
  - ["quickjs:engine".\_\_printObject (exported function)](#quickjsengine__printobject-exported-function)

# "quickjs:engine" (namespace)

```ts
declare module "quickjs:engine" {
  export function isMainModule(resolvedFilepath: string): boolean;
  export function setMainModule(resolvedFilepath: string): void;
  export function evalScript(
    code: string,
    options?: {
      backtraceBarrier?: boolean;
      filename?: string;
      async?: boolean;
    },
  ): any;
  export function runScript(filename: string): any;
  export function importModule(
    filename: string,
    basename?: string,
    options?: {
      with?: Record<string, string>;
    },
  ): {
    [key: string]: any;
  };
  export function resolveModule(
    filename: string,
    basename?: string,
    options?: {
      with?: Record<string, string>;
    },
  ): string;
  export function getFileNameFromStack(stackLevels?: number): string;
  export function isModuleNamespace(target: any): boolean;
  export function defineBuiltinModule(
    name: string,
    obj: {
      [key: string]: any;
    },
  ): void;
  export const ModuleDelegate: ModuleDelegate;
  export function gc(): void;
  export type StackFrameMapper = (
    filename: string,
    line: number,
    column: number,
  ) =>
    | {
        filename: string;
        line: number;
        column: number;
      }
    | null
    | undefined;
  export function setStackFrameMapper(
    mapper: StackFrameMapper | null | undefined,
  ): void;
  export function getStackFrameMapper(): StackFrameMapper | null;
  export function formatValue(
    value: any,
    options?: {
      showHidden?: boolean;
      showClosure?: boolean;
      rawDump?: boolean;
      maxDepth?: number;
      maxStringLength?: number;
      maxItemCount?: number;
    },
  ): string;
  export function __printObject(value: any): void;
}
```

## "quickjs:engine".isMainModule (exported function)

Return whether the provided resolved module path is set as the main module.

In other words, return what the value of `import.meta.main` would be within
the module.

The main module can be set via [setMainModule](/meta/generated-docs/engine.md#quickjsenginesetmainmodule-exported-function).

```ts
export function isMainModule(resolvedFilepath: string): boolean;
```

## "quickjs:engine".setMainModule (exported function)

Set the main module to the module with the provided resolved path.

This will affect the value of `import.meta.main` for modules loaded in the
future, but it will NOT retroactively change the value of
`import.meta.main` in existing already-loaded modules.

```ts
export function setMainModule(resolvedFilepath: string): void;
```

## "quickjs:engine".evalScript (exported function)

Evaluate the string `code` as a script (global eval).

- `@param` _code_ — The code to evaluate.
- `@param` _options_ — An optional object containing the following optional properties:
- `@property` _backtraceBarrier_ — Boolean (default = false). If true, error backtraces do not list the stack frames below the evalScript.
- `@property` _filename_ — String (default = "<evalScript>"). The filename to associate with the code being executed.
- `@property` _async_ — Boolean (default = false). If true, `await` is accepted at the top level of `code` and a Promise is returned.
- `@returns` The result of the evaluation. If `async` is true, a Promise.

```ts
export function evalScript(
  code: string,
  options?: {
    backtraceBarrier?: boolean;
    filename?: string;
    async?: boolean;
  },
): any;
```

## "quickjs:engine".runScript (exported function)

Evaluate the file `filename` as a script (global eval).

- `@param` _filename_ — The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
- `@returns` The result of the evaluation.

```ts
export function runScript(filename: string): any;
```

## "quickjs:engine".importModule (exported function)

Evaluate the file `filename` as a module. Effectively a synchronous dynamic `import()`.

- `@param` _filename_ — The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
- `@param` _basename_ — If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
- `@param` _options_ — Mirrors the second argument of dynamic `import()`. Its `with` property carries import attributes, eg `{ with: { type: "json" } }`.
- `@returns` The result of the evaluation (module namespace object).

```ts
export function importModule(
  filename: string,
  basename?: string,
  options?: {
    with?: Record<string, string>;
  },
): {
  [key: string]: any;
};
```

## "quickjs:engine".resolveModule (exported function)

Return the resolved path to a module.

- `@param` _filename_ — The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
- `@param` _basename_ — If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
- `@param` _options_ — Mirrors the second argument of dynamic `import()`. Its `with` property carries import attributes, eg `{ with: { type: "json" } }`.
- `@returns` The resolved module path.

```ts
export function resolveModule(
  filename: string,
  basename?: string,
  options?: {
    with?: Record<string, string>;
  },
): string;
```

## "quickjs:engine".getFileNameFromStack (exported function)

Read the script of module filename from an active stack frame, then return it as a string.

If there isn't a valid filename for the specified stack frame, an error will be thrown.

- `@param` _stackLevels_ — How many levels up the stack to search for a filename. Defaults to 0, which uses the current stack frame.

```ts
export function getFileNameFromStack(stackLevels?: number): string;
```

## "quickjs:engine".isModuleNamespace (exported function)

Returns true if `target` is a module namespace object.

```ts
export function isModuleNamespace(target: any): boolean;
```

## "quickjs:engine".defineBuiltinModule (exported function)

Create a virtual built-in module whose exports consist of the own
enumerable properties of `obj`.

```ts
export function defineBuiltinModule(
  name: string,
  obj: {
    [key: string]: any;
  },
): void;
```

## "quickjs:engine".ModuleDelegate (exported ModuleDelegate)

An object which lets you configure the module loader (import/export/require).
You can change these properties to add support for importing new filetypes.

```ts
const ModuleDelegate: ModuleDelegate;
```

## "quickjs:engine".gc (exported function)

Manually invoke the cycle removal algorithm (garbage collector).

The cycle removal algorithm is automatically started when needed, so this
function is useful in case of specific memory constraints or for testing.

```ts
export function gc(): void;
```

## "quickjs:engine".StackFrameMapper (exported type)

A callback that translates the location of a stack frame as an error's
backtrace is built. See [setStackFrameMapper](/meta/generated-docs/engine.md#quickjsenginesetstackframemapper-exported-function) for details.

`line` and `column` are 1-based, both for the values passed in and for the
values returned. To change the frame's location, return an object
containing all three of `filename`, `line`, and `column`. Return `null` or
`undefined` (or an object missing any field) to leave the location
unchanged.

```ts
type StackFrameMapper = (
  filename: string,
  line: number,
  column: number,
) =>
  | {
      filename: string;
      line: number;
      column: number;
    }
  | null
  | undefined;
```

## "quickjs:engine".setStackFrameMapper (exported function)

Register a callback that translates the location of each stack frame as an
error's backtrace is built. This is the hook to use for source-map support:
the engine itself knows nothing about source maps, so the callback is where
you map a compiled `(filename, line, column)` back to its original source
location.

The callback is invoked once per frame while the backtrace string is being
assembled. The location it returns is used both in the human-readable
`error.stack` string AND in the `fileName` / `lineNumber` / `columnNumber`
own properties set on the error object, so they stay consistent.

`line` and `column` are 1-based, both for the values passed to the callback
and for the values it returns.

To take effect, the callback must return an object containing all three of
`filename`, `line`, and `column`. If it instead returns `null` or
`undefined`, returns an object missing any of those fields, returns a
non-object, or throws, the frame's original location is kept unchanged (a
thrown error is swallowed rather than propagated into backtrace
construction).

Only one mapper can be registered at a time; registering a new one replaces
the previous one. Pass `null` or `undefined` to unregister, restoring the
default behavior of reporting compiled locations.

While the mapper is running, it is temporarily disabled for any error thrown
from within it, so an error thrown inside the mapper will not recurse
infinitely; that nested error's backtrace simply reports its original
(unmapped) locations.

- `@param` _mapper_ — The translation callback, or `null`/`undefined` to unregister.

```ts
export function setStackFrameMapper(
  mapper: StackFrameMapper | null | undefined,
): void;
```

## "quickjs:engine".getStackFrameMapper (exported function)

Return the stack frame mapper currently registered via
[setStackFrameMapper](/meta/generated-docs/engine.md#quickjsenginesetstackframemapper-exported-function), or `null` if none is registered.

This is useful for composing mappers: read the existing one, then register
a new mapper that adds your own behavior and delegates to the previous one.

```js
const previous = getStackFrameMapper();
setStackFrameMapper((filename, line, column) => {
  const mapped = previous ? previous(filename, line, column) : null;
  const location = mapped ?? { filename, line, column };
  // ...apply your own additional adjustments to `location`...
  return location;
});
```

```ts
export function getStackFrameMapper(): StackFrameMapper | null;
```

## "quickjs:engine".formatValue (exported function)

Format a value for debugging using QuickJS's built-in C-level printer.

This is a parallel formatter to [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction) — it uses the engine's
internal pretty-printer (the same one used by `JS_PrintValue` in the C
API). It can show things JS cannot, like the closure variables of a
function (with `showClosure: true`), and runs without invoking any
user-defined `toString` / `[Symbol.toPrimitive]` / Proxy traps in
`rawDump` mode.

For typical script-level value formatting, `inspect()` is usually a
better choice — it is more configurable, handles cycles via path
strings, and supports custom formatters via `inspect.custom`. Reach for
`formatValue` when you need C-level introspection (closure access) or
a side-effect-free dump (`rawDump`).

- `@param` _value_ — The value to format.
- `@param` _options_ — Optional formatting options.
- `@property` _showHidden_ — Boolean (default = false). Include non-enumerable properties.
- `@property` _showClosure_ — Boolean (default = false). For functions, include closure variables and home object.
- `@property` _rawDump_ — Boolean (default = false). Skip toString/toPrimitive/Proxy traps; print raw structural info.
- `@property` _maxDepth_ — Number (default = 2, hard cap = 8). Recursion limit. Set to 0 for the hard cap.
- `@property` _maxStringLength_ — Number (default = 1000). Truncate strings longer than this. Set to 0 for unlimited.
- `@property` _maxItemCount_ — Number (default = 100). Truncate arrays/objects with more entries than this. Set to 0 for unlimited.
- `@returns` The formatted string.

```ts
export function formatValue(
  value: any,
  options?: {
    showHidden?: boolean;
    showClosure?: boolean;
    rawDump?: boolean;
    maxDepth?: number;
    maxStringLength?: number;
    maxItemCount?: number;
  },
): string;
```

## "quickjs:engine".\_\_printObject (exported function)

Format a value using QuickJS's built-in C-level printer and write the
result directly to stdout (no trailing newline).

Equivalent in spirit to `process.stdout.write(formatValue(value))`,
but writes directly via the C API without building a JS string in
between. Provided for API parity with the underlying `JS_PrintValue`
C API.

The `__` prefix marks this as a direct mirror of upstream QuickJS's
`std.__printObject` API (relocated to `quickjs:engine` in this fork
because the fork has been moving `std` helpers to `engine`).

- `@param` _value_ — The value to print.

```ts
export function __printObject(value: any): void;
```
