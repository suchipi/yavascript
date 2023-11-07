# `RegExp.escape` - escape regular expression tokens in a string

The function `RegExp.escape` accepts an input string and prefixes with `\` those characters in that string which have a special meaning when appearing in a regular expression.

The implementation is based on the stage 2 ECMAScript proposal of the same name: https://github.com/tc39/proposal-regex-escaping

```ts
// Defined in yavascript/src/api/regexp-escape
declare function RegExp.escape(input: string): string;
```
