/**
 * A separate global context (or 'realm') within which code can be executed.
 *
 * This is the same as {@link import("quickjs:context")}, but with a
 * `yavascriptGlobals` option added.
 *
 * **Example**
 * ```ts
 * const context = new Context();
 * context.eval("globalThis.x = 5");
 * console.log(context.eval("x * 2"));
 * ```
 */
declare class Context {
  /**
   * Create a new global context (or 'realm') within code can be executed.
   *
   * @param options Options for what globals/modules/etc to make available within the context.
   *
   * The following globals are always present, regardless of options:
   *
   * - Object
   * - Function
   * - Error
   * - EvalError
   * - RangeError
   * - ReferenceError
   * - SyntaxError
   * - TypeError
   * - URIError
   * - InternalError
   * - AggregateError
   * - Array
   * - parseInt
   * - parseFloat
   * - isNaN
   * - isFinite
   * - decodeURI
   * - decodeURIComponent
   * - encodeURI
   * - encodeURIComponent
   * - escape
   * - unescape
   * - Infinity
   * - NaN
   * - undefined
   * - Number
   * - Boolean
   * - String
   * - Math
   * - Reflect
   * - Symbol
   * - eval (but it doesn't work unless the `eval` option is enabled)
   * - globalThis
   *
   * Note that new contexts don't have a `scriptArgs` global. If you need one
   * to be present in the new context, you can add one onto the Context's
   * `globalThis` property.
   *
   * **Example**
   * ```ts
   * const sandbox = new Context({
   *   yavascriptGlobals: false,
   *   moduleGlobals: false,
   *   timers: false,
   * });
   * console.log(sandbox.eval("typeof setTimeout"));
   * ```
   */
  constructor(options?: {
    /**
     * Enables `Date`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ date: false, yavascriptGlobals: false });
     * console.log(context.eval("typeof Date"));
     * ```
     */
    date?: boolean;

    /**
     * Enables `eval`, Function constructor, etc. Defaults to `true`.
     *
     * > NOTE: The {@link Context.eval} method will still work even with this
     * > option set to false. This option only disables eval *within* the
     * > context.
     *
     * **Example**
     * ```ts
     * const context = new Context({ eval: false });
     * console.log(context.eval("1 + 1"));
     * ```
     */
    eval?: boolean;

    /**
     * Enables `String.prototype.normalize`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ stringNormalize: false });
     * console.log(context.eval("typeof String.prototype.normalize"));
     * ```
     */
    stringNormalize?: boolean;

    /**
     * Enables `RegExp`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ regExp: false, yavascriptGlobals: false });
     * console.log(context.eval("typeof RegExp"));
     * ```
     */
    regExp?: boolean;

    /**
     * Enables `JSON`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ json: false });
     * console.log(context.eval("typeof JSON"));
     * ```
     */
    json?: boolean;

    /**
     * Enables `Proxy`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ proxy: false, yavascriptGlobals: false });
     * console.log(context.eval("typeof Proxy"));
     * ```
     */
    proxy?: boolean;

    /**
     * Enables `Map` and `Set`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ mapSet: false, yavascriptGlobals: false });
     * console.log(context.eval("typeof Map"), context.eval("typeof Set"));
     * ```
     */
    mapSet?: boolean;

    /**
     * Enables:
     *
     * - ArrayBuffer
     * - SharedArrayBuffer
     * - Uint8ClampedArray
     * - Int8Array
     * - Uint8Array
     * - Int16Array
     * - Uint16Array
     * - Int32Array
     * - Uint32Array
     * - BigInt64Array
     * - BigUint64Array
     * - Float32Array
     * - Float64Array
     * - DataView
     *
     * Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ typedArrays: false });
     * console.log(context.eval("typeof Uint8Array"));
     * ```
     */
    typedArrays?: boolean;

    /**
     * Enables:
     *
     * - Promise
     * - async functions
     * - async iterators
     * - async generators
     *
     * Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({
     *   promise: false,
     *   yavascriptGlobals: false,
     * });
     * console.log(context.eval("typeof Promise"));
     * ```
     */
    promise?: boolean;

    /**
     * Enables `inspect`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({
     *   inspect: false,
     *   yavascriptGlobals: false,
     * });
     * console.log(context.eval("typeof inspect"));
     * ```
     */
    inspect?: boolean;
    /**
     * Enables the QuickJS `console` object. Defaults to `true`.
     *
     * YavaScript extends the builtin QuickJS `console` by passing its arguments
     * through `inspect`. To gain this functionality, pass option
     * `yavascriptGlobals: true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({
     *   console: false,
     *   yavascriptGlobals: false,
     * });
     * console.log(context.eval("typeof console"));
     * ```
     */
    console?: boolean;
    /**
     * Enables the QuickJS `print` object. Defaults to `true`.
     *
     * YavaScript extends the builtin QuickJS `print` by passing its arguments
     * through `inspect`. To gain this functionality, pass option
     * `yavascriptGlobals: true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ print: false, yavascriptGlobals: false });
     * console.log(context.eval("typeof print"));
     * ```
     */
    print?: boolean;
    /**
     * Enables `require`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({
     *   moduleGlobals: false,
     *   yavascriptGlobals: false,
     * });
     * console.log(context.eval("typeof require"));
     * ```
     */
    moduleGlobals?: boolean;
    /**
     * Enables `setTimeout`, `clearTimeout`, `setInterval`, and
     * `clearInterval`. Defaults to `true`.
     *
     * **Example**
     * ```ts
     * const context = new Context({ timers: false });
     * console.log(context.eval("typeof setTimeout"));
     * ```
     */
    timers?: boolean;

    /**
     * Enables YavaScript's builtin global APIs, like `exec`, `assert`, `TOML`,
     * etc.
     *
     * Defaults to `true`.
     *
     * > NOTE: Be aware that the Context's `Context`, `Worker`, and
     * > `runInWorker` globals get created in the main context. Some obscure
     * > things (like `instanceof Function`) therefore won't work, but
     * > everything that matters in practice will work just fine. All other
     * > globals get created within the child context.
     *
     * **Example**
     * ```ts
     * const context = new Context({ yavascriptGlobals: false });
     * console.log(context.eval("typeof exec"));
     * ```
     */
    yavascriptGlobals?: boolean;

    /**
     * Enable builtin modules.
     *
     * **Example**
     * ```ts
     * const context = new Context({
     *   yavascriptGlobals: false,
     *   modules: { "quickjs:os": false, "quickjs:std": false },
     * });
     * ```
     */
    modules?: {
      /**
       * Enables the "quickjs:bytecode" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:bytecode": false },
       * });
       * ```
       */
      "quickjs:bytecode"?: boolean;
      /**
       * Enables the "quickjs:cmdline" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:cmdline": false },
       * });
       * ```
       */
      "quickjs:cmdline"?: boolean;
      /**
       * Enables the "quickjs:context" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   modules: { "quickjs:context": false },
       * });
       * ```
       */
      "quickjs:context"?: boolean;
      /**
       * Enables the "quickjs:encoding" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:encoding": false },
       * });
       * ```
       */
      "quickjs:encoding"?: boolean;
      /**
       * Enables the "quickjs:engine" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:engine": false },
       * });
       * ```
       */
      "quickjs:engine"?: boolean;
      /**
       * Enables the "quickjs:os" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:os": false },
       * });
       * ```
       */
      "quickjs:os"?: boolean;
      /**
       * Enables the "quickjs:std" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   yavascriptGlobals: false,
       *   modules: { "quickjs:std": false },
       * });
       * ```
       */
      "quickjs:std"?: boolean;
      /**
       * Enables the "quickjs:timers" module. Defaults to `true`.
       *
       * **Example**
       * ```ts
       * const context = new Context({
       *   modules: { "quickjs:timers": false },
       * });
       * ```
       */
      "quickjs:timers"?: boolean;
    };
  });

  /**
   * The `globalThis` object used by this context.
   *
   * You can add to or remove from it to change what is visible to the context.
   *
   * **Example**
   * ```ts
   * const context = new Context();
   * Object.assign(context.globalThis, { greeting: "hello" });
   * console.log(context.eval("greeting"));
   * ```
   */
  globalThis: typeof globalThis;

  /**
   * Runs code within the context and returns the result.
   *
   * @param code The code to run.
   *
   * > NOTE: This function will work even if you created the Context with option
   * > `eval: false` (which only disables eval *within* the context).
   *
   * **Example**
   * ```ts
   * const context = new Context();
   * const doubled = context.eval("[1, 2, 3].map((n) => n * 2)");
   * console.log(doubled);
   * ```
   */
  eval(code: string): any;
}
