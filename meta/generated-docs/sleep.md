- [sleep (function)](#sleep-function)
  - [sleep(...) (call signature)](#sleep-call-signature)
  - [sleep.sync (method)](#sleepsync-method)
  - [sleep.async (method)](#sleepasync-method)

# sleep (function)

`sleep` and `sleep.sync` block the current thread for at least the specified
number of milliseconds, but maybe a tiny bit longer.

`sleep.async` returns a Promise which resolves in at least the specified
number of milliseconds, but maybe a tiny bit longer.

`sleep` and `sleep.sync` block the current thread. `sleep.async` doesn't
block the current thread.

"Blocking the thread" means no other JavaScript code can run while `sleep` or
`sleep.sync` is running. If this is not the behavior you want, use
`sleep.async` instead.

```ts
var sleep: {
  (milliseconds: number): void;
  sync(milliseconds: number): void;
  async(milliseconds: number): Promise<void>;
};
```

## sleep(...) (call signature)

Blocks the current thread for at least the specified number of
milliseconds, but maybe a tiny bit longer.

alias for `sleep.sync`.

- `@param` _milliseconds_ — The number of milliseconds to block for.

No other JavaScript code can run while `sleep()` is running. If this is
not the behavior you want, use `sleep.async` instead.

```ts
(milliseconds: number): void;
```

## sleep.sync (method)

Blocks the current thread for at least the specified number of
milliseconds, but maybe a tiny bit longer.

- `@param` _milliseconds_ — The number of milliseconds to block for.

No other JavaScript code can run while `sleep.sync` is running. If this is
not the behavior you want, use `sleep.async` instead.

```ts
sync(milliseconds: number): void;
```

## sleep.async (method)

Returns a Promise which resolves in at least the specified number of
milliseconds, maybe a little longer.

- `@param` _milliseconds_ — The number of milliseconds to wait before the returned Promise should be resolved.

`sleep.async` doesn't block the current thread, so other JavaScript code
(registered event handlers, async functions, timers, etc) can run while
`sleep.async`'s return Promise is waiting to resolve. If this is not the
behavior you want, use `sleep.sync` instead.

The Promise returned by `sleep.async` will never get rejected. It will only
ever get resolved.

```ts
async(milliseconds: number): Promise<void>;
```
