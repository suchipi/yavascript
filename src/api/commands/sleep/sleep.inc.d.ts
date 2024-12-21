/**
 * Blocks the current thread for at least the specified number of milliseconds,
 * but maybe a tiny bit longer.
 *
 * alias for `sleep.sync`.
 */
declare var sleep: {
  /**
   * Blocks the current thread for at least the specified number of milliseconds,
   * but maybe a tiny bit longer.
   *
   * alias for `sleep.sync`.
   *
   * @param milliseconds - The number of milliseconds to block for.
   */
  (milliseconds: number): void;

  /**
   * Blocks the current thread for at least the specified number of milliseconds,
   * but maybe a tiny bit longer.
   *
   * @param milliseconds - The number of milliseconds to block for.
   */
  sync(milliseconds: number): void;

  /**
   * Returns a Promise which resolves in at least the specified number of
   * milliseconds, maybe a little longer.
   *
   * @param milliseconds - The number of milliseconds to wait before the returned Promise should be resolved.
   */
  async(milliseconds: number): Promise<void>;
};
