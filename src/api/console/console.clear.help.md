`console.clear` - Clears the terminal screen.

`console.clear` prints special ANSI escape characters to stdout which instruct your terminal emulator to clear the screen and clear your terminal scrollback.

```ts
// Defined in yavascript/src/api/console
declare function clear(): void;
```
