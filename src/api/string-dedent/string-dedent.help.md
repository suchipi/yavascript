# `String.dedent` - remove leading indentation from a string

The function `String.dedent` can be used to remove leading indentation from a string. It is commonly used as a tagged template function, but you can also call it and pass in a string.

`String.dedent` is the default export from the npm package `string-dedent`. See its readme on npm for more info: https://www.npmjs.com/package/string-dedent

```ts
// Defined in yavascript/src/api/string-dedent
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
