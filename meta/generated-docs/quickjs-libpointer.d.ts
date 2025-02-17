# "quickjs:pointer" (namespace)

```ts
declare module "quickjs:pointer" {
  export class Pointer {
    static NULL: Pointer;
    static isPointer(value: any): boolean;
    _info?: string;
  }
}
```

## "quickjs:pointer".Pointer (exported class)

An opaque pointer value which can be passed around by JS

```ts
class Pointer {
  static NULL: Pointer;
  static isPointer(value: any): boolean;
  _info?: string;
}
```

### Pointer.NULL (static Pointer property)

```ts
static NULL: Pointer;
```

### Pointer.isPointer (static method)

Returns a boolean indicating whether the provided value is a `Pointer` object.

```ts
static isPointer(value: any): boolean;
```

### Pointer.prototype.\_info (string property)

For debug logging purposes only; format can vary from platform to platform and is not guaranteed to be present or consistent.

```ts
_info?: string;
```
