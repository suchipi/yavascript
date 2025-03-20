- [RegExpConstructor (interface)](#regexpconstructor-interface)
  - [RegExpConstructor.escape (method)](#regexpconstructorescape-method)

# RegExpConstructor (interface)

```ts
interface RegExpConstructor {
  escape(str: any): string;
}
```

## RegExpConstructor.escape (method)

The function `RegExp.escape` accepts an input string and prefixes with `\`
those characters in that string which have a special meaning when appearing
in a regular expression.

The implementation is based on the stage 2 ECMAScript proposal of the same
name: https://github.com/tc39/proposal-regex-escaping

```ts
escape(str: any): string;
```
