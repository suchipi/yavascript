---
hide_title: true
---
## ObjectConstructor (interface)

```ts
interface ObjectConstructor {
  toPrimitive(
    input: any,
    hint: "string" | "number" | "default",
  ): string | number | bigint | boolean | undefined | symbol | null;
  isPrimitive(input: any): boolean;
}
```

### ObjectConstructor.toPrimitive (method)

Convert the specified value to a primitive value.

The provided hint indicates a preferred return type, which may or may not
be respected by the engine.

See the abstract operation "ToPrimitive" in the ECMAScript standard for
more info.

```ts
toPrimitive(input: any, hint: "string" | "number" | "default"): string | number | bigint | boolean | undefined | symbol | null;
```

### ObjectConstructor.isPrimitive (method)

Returns a boolean indicating whether the specified value is a primitive value.

```ts
isPrimitive(input: any): boolean;
```

## StringConstructor (interface)

```ts
interface StringConstructor {
  cooked(
    strings: readonly string[] | ArrayLike<string>,
    ...substitutions: any[]
  ): string;
}
```

### StringConstructor.cooked (method)

A no-op template literal tag.

https://github.com/tc39/proposal-string-cooked

```ts
cooked(strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]): string;
```
