declare namespace JSX {
  /**
   * A string containing the expression that should be called to create JSX
   * elements. yavascript's internals use this string to transpile JSX syntax.
   *
   * Defaults to "JSX.createElement".
   *
   * If changed, any JSX code loaded afterwards will use a different
   * expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing {@link types.JSX.Element}
   * and {@link types.JSX.Fragment}):
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>)
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   */
  export let pragma: string;

  /**
   * A string containing the expression that should be used as the first
   * parameter when creating JSX fragment elements. yavascript's internals use
   * this string to transpile JSX syntax.
   *
   * Defaults to "JSX.Fragment".
   *
   * If changed, any JSX code loaded afterwards will use a different
   * expression.
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing {@link types.JSX.Element}
   * and {@link types.JSX.Fragment}):
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>)
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   */
  export let pragmaFrag: string;

  export const Element: unique symbol;

  export interface Element<
    Props = { [key: string | symbol | number]: any },
    Type = any
  > {
    $$typeof: typeof Element;
    type: Type;
    props: Props;
    key: string | number | null;
  }

  /**
   * The value which gets passed into the JSX element constructor (as
   * determined by {@link JSX.pragma}) when JSX fragment syntax is used (unless
   * {@link JSX.pragmaFrag} is changed).
   */
  export const Fragment: unique symbol;

  export type Fragment = Element<{}, typeof Fragment>;

  /**
   * The JSX element builder function, which gets invoked whenever JSX syntax is
   * used (unless {@link JSX.pragma} is changed).
   *
   * Note that if you change this, you need to verify that the following
   * expression always evaluates to `true` (by changing {@link types.JSX.Element}
   * and {@link types.JSX.Fragment}):
   * ```jsx
   * types.JSX.Element(<a />) && types.JSX.Fragment(<></>)
   * ```
   *
   * Failure to uphold this guarantee indicates a bug.
   */
  export let createElement: {
    <Type extends string | typeof Fragment | ((...args: any) => any)>(
      type: Type
    ): Element<{}, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends { [key: string | number | symbol]: any }
    >(
      type: Type,
      props: Props
    ): Element<Props, Type>;

    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends { [key: string | number | symbol]: any },
      Children extends Array<any>
    >(
      type: Type,
      props: Props,
      ...children: Children
    ): Element<Props & { children: Children }, Type>;

    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Children extends Array<any>
    >(
      type: Type,
      ...children: Children
    ): Element<{ children: Children }, Type>;
  };
}
