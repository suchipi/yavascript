- ["quickjs:encoding" (namespace)](#quickjsencoding-namespace)
  - ["quickjs:encoding".toUtf8 (exported function)](#quickjsencodingtoutf8-exported-function)
  - ["quickjs:encoding".fromUtf8 (exported function)](#quickjsencodingfromutf8-exported-function)

# "quickjs:encoding" (namespace)

```ts
declare module "quickjs:encoding" {
  export function toUtf8(input: ArrayBuffer): string;
  export function fromUtf8(input: string): ArrayBuffer;
}
```

## "quickjs:encoding".toUtf8 (exported function)

```ts
export function toUtf8(input: ArrayBuffer): string;
```

## "quickjs:encoding".fromUtf8 (exported function)

```ts
export function fromUtf8(input: string): ArrayBuffer;
```
