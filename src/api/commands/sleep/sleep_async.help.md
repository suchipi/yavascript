# `sleep.async` - Wait for a while without blocking the thread

`sleep.async` returns a Promise which resolves in at least the specified number of milliseconds, but maybe a tiny bit longer.

`sleep.async` doesn't block the current thread, so other JavaScript code (registered event handlers, async functions, timers, etc) can run while `sleep.async`'s return Promise is waiting to resolve. If this is not the behavior you want, use `sleep.sync` instead.

The Promise returned by `sleep.async` will never get rejected. It will only ever get resolved.

```ts
// Defined in yavascript/src/api/commands/sleep
declare function sleep.async(milliseconds: number): Promise<void>;
```
