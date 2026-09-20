- [RegExpConstructor (interface)](#regexpconstructor-interface)
  - [RegExpConstructor.escape (method)](#regexpconstructorescape-method)

# RegExpConstructor (interface)

```ts
interface RegExpConstructor {
  escape(str: string): string;
}
```

## RegExpConstructor.escape (method)

The function `RegExp.escape` accepts an input string and escapes those
characters in it which would otherwise have a special meaning when
appearing in a regular expression.

Throws a TypeError if `str` isn't a string.

```ts
escape(str: string): string;
```
