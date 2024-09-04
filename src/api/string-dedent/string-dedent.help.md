# `String.dedent` - remove leading indentation from a string

The function `String.dedent` can be used to remove leading indentation from a string. It is commonly used as a tagged template function, but you can also call it and pass in a string.

`String.dedent` is the default export from the npm package `string-dedent`. See its readme on npm for more info: https://www.npmjs.com/package/string-dedent

```ts
// Defined in yavascript/src/api/string-dedent
declare function String.dedent(str: string): string;
declare function String.dedent(str: TemplateStringsArray, ...substitutions: unknown[]): string;
declare function String.dedent<A extends unknown[], R, T>(
  tag: (this: T, strings: TemplateStringsArray, ...substitutions: A) => R
): (this: T, strings: TemplateStringsArray, ...substitutions: A) => R;
```
