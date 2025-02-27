/**
 * `sleep` and `sleep.sync` block the current thread for at least the specified
 * number of milliseconds, but maybe a tiny bit longer.
 *
 * `sleep.async` returns a Promise which resolves in at least the specified
 * number of milliseconds, but maybe a tiny bit longer.
 *
 * `sleep` and `sleep.sync` block the current thread. `sleep.async` doesn't
 * block the current thread.
 *
 * "Blocking the thread" means no other JavaScript code can run while `sleep` or
 * `sleep.sync` is running. If this is not the behavior you want, use
 * `sleep.async` instead.
 */
declare var sleep: {
  /**
   * Blocks the current thread for at least the specified number of
   * milliseconds, but maybe a tiny bit longer.
   *
   * alias for `sleep.sync`.
   *
   * @param milliseconds - The number of milliseconds to block for.
   *
   * No other JavaScript code can run while `sleep()` is running. If this is
   * not the behavior you want, use `sleep.async` instead.
   */
  (milliseconds: number): void;

  /**
   * Blocks the current thread for at least the specified number of
   * milliseconds, but maybe a tiny bit longer.
   *
   * @param milliseconds - The number of milliseconds to block for.
   *
   * No other JavaScript code can run while `sleep.sync` is running. If this is
   * not the behavior you want, use `sleep.async` instead.
   */
  sync(milliseconds: number): void;

  /**
   * Returns a Promise which resolves in at least the specified number of
   * milliseconds, maybe a little longer.
   *
   * @param milliseconds - The number of milliseconds to wait before the returned Promise should be resolved.
   *
   * `sleep.async` doesn't block the current thread, so other JavaScript code
   * (registered event handlers, async functions, timers, etc) can run while
   * `sleep.async`'s return Promise is waiting to resolve. If this is not the
   * behavior you want, use `sleep.sync` instead.
   *
   * The Promise returned by `sleep.async` will never get rejected. It will only
   * ever get resolved.
   */
  async(milliseconds: number): Promise<void>;
};
