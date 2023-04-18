`echo` - Print stuff to the screen

Print one or more values to stdout.

Provides the same functionality as the shell builtin of the same name.

> NOTE: This can print any value, not just strings.

```ts
// Defined in yavascript/src/api/commands/echo.ts
declare function echo(...args: Array<any>): void;
```
