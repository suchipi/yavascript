/**
 * `print` is an alias for {@link console.log}, which prints values to stdout.
 *
 * Any value can be logged, not just strings. Non-string values will be
 * formatted using {@link inspect}.
 *
 * **Example**
 * ```ts
 * print("hello", [1, 2, 3]);
 * ```
 */
declare function print(...args: any): void;
