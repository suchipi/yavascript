---
hide_title: true
---
## StringConstructor (interface)

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
      ) => string,
    >(
      input: Func,
    ): Func;
  };
}
```

### StringConstructor.dedent (function property)

The function `String.dedent` can be used to remove leading indentation from
a string. It is commonly used as a tagged template function, but you can
also call it and pass in a string.

Note that the first line of the string must be empty.

`String.dedent` is the default export from the npm package `string-dedent`.
See its readme on npm for more info:
https://www.npmjs.com/package/string-dedent

**Example**

```ts
const usage = String.dedent`
  Usage: my-script [options]

    --help  Show this message
`;
console.log(usage);
```

```ts
dedent: {
  (input: string): string;
  (strings: readonly string[] | ArrayLike<string>, ...substitutions: unknown[]): string;
  <Func extends (strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]) => string>(input: Func): Func;
};
```

#### StringConstructor.dedent(...) (call signature)

Removes leading minimum indentation from the string `input`.
The first line of `input` MUST be empty.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

**Example**

```ts
const text = String.dedent("\n    first line\n      second line\n");
console.log(text);
```

```ts
(input: string): string;
```

#### StringConstructor.dedent(...) (call signature)

Removes leading minimum indentation from the tagged template literal.
The first line of the template literal MUST be empty.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

**Example**

```ts
const name = "world";
const message = String.dedent`
  Hello, ${name}!
    This line stays indented by two spaces.
`;
console.log(message);
```

```ts
(strings: readonly string[] | ArrayLike<string>, ...substitutions: unknown[]): string;
```

#### StringConstructor.dedent(...) (call signature)

Wrap another template tag function such that tagged literals
become dedented before being passed to the wrapped function.

For more info, see: https://www.npmjs.com/package/string-dedent#usage

**Example**

```ts
const shout = (strings: ArrayLike<string>, ...values: any[]) =>
  String.raw({ raw: strings }, ...values).toUpperCase();
const dedentedShout = String.dedent(shout);
console.log(dedentedShout`
  hello
    world
`);
```

```ts
<Func extends (strings: readonly string[] | ArrayLike<string>, ...substitutions: any[]) => string>(input: Func): Func;
```
