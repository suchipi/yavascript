# "quickjs:bytecode" (namespace)

```ts
declare module "quickjs:bytecode" {
  export function fromFile(
    path: string,
    options?: {
      byteSwap?: boolean;
      sourceType?: "module" | "script";
      encodedFileName?: string;
    },
  ): ArrayBuffer;
  export function fromValue(
    value: any,
    options?: {
      byteSwap?: boolean;
    },
  ): ArrayBuffer;
  export function toValue(bytecode: ArrayBuffer): any;
}
```

## "quickjs:bytecode".fromFile (exported function)

Convert the module or script in the specified file into bytecode.

When converted back to a value, it will be a function.

```ts
function fromFile(
  path: string,
  options?: {
    byteSwap?: boolean;
    sourceType?: "module" | "script";
    encodedFileName?: string;
  },
): ArrayBuffer;
```

## "quickjs:bytecode".fromValue (exported function)

Convert the provided value into bytecode. Doesn't work with all values.

```ts
function fromValue(
  value: any,
  options?: {
    byteSwap?: boolean;
  },
): ArrayBuffer;
```

## "quickjs:bytecode".toValue (exported function)

Convert the provided bytecode into a value.

```ts
function toValue(bytecode: ArrayBuffer): any;
```
