- [StringConstructor (interface)](#stringconstructor-interface)
  - [StringConstructor.dedent (function property)](#stringconstructordedent-function-property)
    - [StringConstructor.dedent(...) (call signature)](#stringconstructordedent-call-signature)
    - [StringConstructor.dedent(...) (call signature)](#stringconstructordedent-call-signature-1)
    - [StringConstructor.dedent(...) (call signature)](#stringconstructordedent-call-signature-2)

# StringConstructor (interface)

```ts
interface StringConstructor {
  dedent: {
    (input: string): string;
    (
      strings: readonly string[] | ArrayLike<string>,
      ...substitutions: unknown[]
    ): string;
    <
      Func extends (
        strings: readonly string[] | ArrayLike<string>,
        ...substitutions: any[]
      ) => string
    >(
      input: Func
    ): Func;
  };
}
```

## StringConstructor.dedent (function property)

The function `String.dedent` can be used to remove leading indentation from
a string. It is commonly used as a tagged template function, but you can
also call it and pass in a string.

Note that the first line of the string must be empty.

`String.dedent` is the default export from the npm package `string-dedent`.
See its readme on npm for more info:
https://www.npmjs.com/package/string-dedent

```ts
dedent: {
  (input: string): string;
  (strings: readonly string[] | ArrayLike<string>, ...substitutions: unknown[]): string;
  <Func extends (strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]) => string>(input: Func): Func;
};
```

### StringConstructor.dedent(...) (call signature)

Removes leading minimum indentation from the string `input`.
The first line of `input` MUST be empty.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

```ts
(input: string): string;
```

### StringConstructor.dedent(...) (call signature)

Removes leading minimum indentation from the tagged template literal.
The first line of the template literal MUST be empty.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

```ts
(strings: readonly string[] | ArrayLike<string>, ...substitutions: unknown[]): string;
```

### StringConstructor.dedent(...) (call signature)

Wrap another template tag function such that tagged literals
become dedented before being passed to the wrapped function.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

```ts
<Func extends (strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]) => string>(input: Func): Func;
```
