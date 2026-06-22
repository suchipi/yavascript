/**
 * A separate global context (or 'realm') within which code can be executed.
 *
 * This is the same as {@link import("quickjs:context")}, but with a
 * `yavascriptGlobals` option added.
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
   */
  constructor(options?: {
    /** Enables `Date`. Defaults to `true`. */
    date?: boolean;

    /**
     * Enables `eval`, Function constructor, etc. Defaults to `true`.
     *
     * > NOTE: The {@link Context.eval} method will still work even with this
     * > option set to false. This option only disables eval *within* the
     * > context.
     */
    eval?: boolean;

    /** Enables `String.prototype.normalize`. Defaults to `true`. */
    stringNormalize?: boolean;

    /** Enables `RegExp`. Defaults to `true`. */
    regExp?: boolean;

    /** Enables `JSON`. Defaults to `true`. */
    json?: boolean;

    /** Enables `Proxy`. Defaults to `true`. */
    proxy?: boolean;

    /** Enables `Map` and `Set`. Defaults to `true`. */
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
     */
    promise?: boolean;

    /** Enables `inspect`. Defaults to `true`. */
    inspect?: boolean;
    /**
     * Enables the QuickJS `console` object. Defaults to `true`.
     *
     * YavaScript extends the builtin QuickJS `console` by passing its arguments
     * through `inspect`. To gain this functionality, pass option
     * `yavascriptGlobals: true`.
     */
    console?: boolean;
    /**
     * Enables the QuickJS `print` object. Defaults to `true`.
     *
     * YavaScript extends the builtin QuickJS `print` by passing its arguments
     * through `inspect`. To gain this functionality, pass option
     * `yavascriptGlobals: true`.
     */
    print?: boolean;
    /** Enables `require`. Defaults to `true`. */
    moduleGlobals?: boolean;
    /**
     * Enables `setTimeout`, `clearTimeout`, `setInterval`, and
     * `clearInterval`. Defaults to `true`.
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
     */
    yavascriptGlobals?: boolean;

    /** Enable builtin modules. */
    modules?: {
      /** Enables the "quickjs:bytecode" module. Defaults to `true`. */
      "quickjs:bytecode"?: boolean;
      /** Enables the "quickjs:cmdline" module. Defaults to `true`. */
      "quickjs:cmdline"?: boolean;
      /** Enables the "quickjs:context" module. Defaults to `true`. */
      "quickjs:context"?: boolean;
      /** Enables the "quickjs:encoding" module. Defaults to `true`. */
      "quickjs:encoding"?: boolean;
      /** Enables the "quickjs:engine" module. Defaults to `true`. */
      "quickjs:engine"?: boolean;
      /** Enables the "quickjs:os" module. Defaults to `true`. */
      "quickjs:os"?: boolean;
      /** Enables the "quickjs:std" module. Defaults to `true`. */
      "quickjs:std"?: boolean;
      /** Enables the "quickjs:timers" module. Defaults to `true`. */
      "quickjs:timers"?: boolean;
    };
  });

  /**
   * The `globalThis` object used by this context.
   *
   * You can add to or remove from it to change what is visible to the context.
   */
  globalThis: typeof globalThis;

  /**
   * Runs code within the context and returns the result.
   *
   * @param code The code to run.
   *
   * > NOTE: This function will work even if you created the Context with option
   * > `eval: false` (which only disables eval *within* the context).
   */
  eval(code: string): any;
}
