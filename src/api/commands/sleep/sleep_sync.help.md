# `sleep.sync` - Block the current thread for a while

`sleep.sync` blocks the current thread for at least the specified number of milliseconds, or maybe a tiny bit longer.

No other JavaScript code can run while `sleep.sync` is running. If this is not the behavior you want, use `sleep.async` instead.

```ts
// Defined in yavascript/src/api/commands/sleep
declare function sleep.sync(milliseconds: number): void;
```
