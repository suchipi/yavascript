- ["quickjs:bytecode" (namespace)](#quickjsbytecode-namespace)
  - ["quickjs:bytecode".fromFile (exported function)](#quickjsbytecodefromfile-exported-function)
  - ["quickjs:bytecode".fromValue (exported function)](#quickjsbytecodefromvalue-exported-function)
  - ["quickjs:bytecode".toValue (exported function)](#quickjsbytecodetovalue-exported-function)

# "quickjs:bytecode" (namespace)

```ts
declare module "quickjs:bytecode" {
  export function fromFile(
    path: string,
    options?: {
      byteSwap?: boolean;
      sourceType?: "module" | "script";
      encodedFileName?: string;
      strip?: "source" | "debug" | false;
    },
  ): ArrayBuffer;
  export function fromValue(
    value: any,
    options?: {
      byteSwap?: boolean;
      preserveReferences?: boolean;
      serializeErrors?: boolean;
    },
  ): ArrayBuffer;
  export function toValue(
    bytecode: ArrayBuffer,
    options?: {
      preserveReferences?: boolean;
      serializeErrors?: boolean;
    },
  ): any;
}
```

## "quickjs:bytecode".fromFile (exported function)

Convert the module or script in the specified file into bytecode.

When converted back to a value, it will be a function.

```ts
export function fromFile(
  path: string,
  options?: {
    byteSwap?: boolean;
    sourceType?: "module" | "script";
    encodedFileName?: string;
    strip?: "source" | "debug" | false;
  },
): ArrayBuffer;
```

## "quickjs:bytecode".fromValue (exported function)

Convert the provided value into bytecode. Doesn't work with all values.

By default, cycles and shared references are preserved — if the same
inner object appears at two positions in `value`, the result
deserialized via `toValue` will have those positions referencing a
single object. Self-referential graphs (e.g. `obj.self = obj`) round-
trip correctly. To opt out and produce a stream that errors on
cycles, pass `preserveReferences: false`.

To serialize Error instances (including `TypeError`, `RangeError`,
`SyntaxError`, `ReferenceError`, `URIError`, `EvalError`,
`AggregateError`, and `InternalError`), pass `serializeErrors: true`.
Without it, attempting to serialize any Error instance throws
"unsupported object class".

```ts
export function fromValue(
  value: any,
  options?: {
    byteSwap?: boolean;
    preserveReferences?: boolean;
    serializeErrors?: boolean;
  },
): ArrayBuffer;
```

## "quickjs:bytecode".toValue (exported function)

Convert the provided bytecode into a value.

Pass `preserveReferences: false` (the default is true) to reject
streams that contain back-references — attempting to decode such a
stream throws "invalid tag". Streams produced by `fromValue` with
its default settings (or with `preserveReferences: true` explicitly)
require the reader's `preserveReferences` to be true as well.

Pass `serializeErrors: true` to reify any serialized Error frames
(see `fromValue`) back into real Error instances. Attempting to
deserialize a bytecode stream that contains an Error frame without
this option throws "invalid tag".

```ts
export function toValue(
  bytecode: ArrayBuffer,
  options?: {
    preserveReferences?: boolean;
    serializeErrors?: boolean;
  },
): any;
```
