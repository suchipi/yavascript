`sleep` - Wait the specified number of milliseconds

`sleep` and `sleep.sync` block the current thread for at least the specified number of milliseconds, or maybe a tiny bit longer.

`sleep.async` returns a Promise which resolves in at least the specified number of milliseconds, or maybe a tiny bit longer.

`sleep` and `sleep.sync` block the current thread. `sleep.async` doesn't block the current thread.

"Blocking the thread" means no other JavaScript code can run while `sleep` or `sleep.sync` is running. If this is not the behavior you want, use `sleep.async` instead.

```ts
// Defined in yavascript/src/api/commands/sleep
declare const sleep: {
  (milliseconds: number): void;
  sync(milliseconds: number): void;
  async(milliseconds: number): Promise<void>;
};
```
