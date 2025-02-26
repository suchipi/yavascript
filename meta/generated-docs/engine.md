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
    }
  ): any;
  export function runScript(filename: string): any;
  export function importModule(
    filename: string,
    basename?: string
  ): {
    [key: string]: any;
  };
  export function resolveModule(filename: string, basename?: string): string;
  export function getFileNameFromStack(stackLevels?: number): string;
  export function isModuleNamespace(target: any): boolean;
  export function defineBuiltinModule(
    name: string,
    obj: {
      [key: string]: any;
    }
  ): void;
  export const ModuleDelegate: ModuleDelegate;
  export function gc(): void;
}
```

## "quickjs:engine".isMainModule (exported function)

Return whether the provided resolved module path is set as the main module.

In other words, return what the value of `import.meta.main` would be within
the module.

The main module can be set via [setMainModule](/meta/generated-docs/engine.md#quickjsenginesetmainmodule-exported-function).

```ts
function isMainModule(resolvedFilepath: string): boolean;
```

## "quickjs:engine".setMainModule (exported function)

Set the main module to the module with the provided resolved path.

This will affect the value of `import.meta.main` for modules loaded in the
future, but it will NOT retroactively change the value of
`import.meta.main` in existing already-loaded modules.

```ts
function setMainModule(resolvedFilepath: string): void;
```

## "quickjs:engine".evalScript (exported function)

Evaluate the string `code` as a script (global eval).

- `@param` _code_ — The code to evaluate.
- `@param` _options_ — An optional object containing the following optional properties:
- `@property` _backtraceBarrier_ — Boolean (default = false). If true, error backtraces do not list the stack frames below the evalScript.
- `@property` _filename_ — String (default = "<evalScript>"). The filename to associate with the code being executed.
- `@returns` The result of the evaluation.

```ts
function evalScript(
  code: string,
  options?: {
    backtraceBarrier?: boolean;
    filename?: string;
  }
): any;
```

## "quickjs:engine".runScript (exported function)

Evaluate the file `filename` as a script (global eval).

- `@param` _filename_ — The relative or absolute path to the file to load. Relative paths are resolved relative to the process's current working directory.
- `@returns` The result of the evaluation.

```ts
function runScript(filename: string): any;
```

## "quickjs:engine".importModule (exported function)

Evaluate the file `filename` as a module. Effectively a synchronous dynamic `import()`.

- `@param` _filename_ — The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
- `@param` _basename_ — If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
- `@returns` The result of the evaluation (module namespace object).

```ts
function importModule(
  filename: string,
  basename?: string
): {
  [key: string]: any;
};
```

## "quickjs:engine".resolveModule (exported function)

Return the resolved path to a module.

- `@param` _filename_ — The relative or absolute path to the file to import. Relative paths are resolved relative to the file calling `importModule`, or `basename` if present.
- `@param` _basename_ — If present and `filename` is a relative path, `filename` will be resolved relative to this basename.
- `@returns` The resolved module path.

```ts
function resolveModule(filename: string, basename?: string): string;
```

## "quickjs:engine".getFileNameFromStack (exported function)

Read the script of module filename from an active stack frame, then return it as a string.

If there isn't a valid filename for the specified stack frame, an error will be thrown.

- `@param` _stackLevels_ — How many levels up the stack to search for a filename. Defaults to 0, which uses the current stack frame.

```ts
function getFileNameFromStack(stackLevels?: number): string;
```

## "quickjs:engine".isModuleNamespace (exported function)

Returns true if `target` is a module namespace object.

```ts
function isModuleNamespace(target: any): boolean;
```

## "quickjs:engine".defineBuiltinModule (exported function)

Create a virtual built-in module whose exports consist of the own
enumerable properties of `obj`.

```ts
function defineBuiltinModule(
  name: string,
  obj: {
    [key: string]: any;
  }
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
function gc(): void;
```
