# JSX (namespace)

```ts
declare namespace JSX {
  export let pragma: string;
  export let pragmaFrag: string;
  export const Element: unique symbol;
  export interface Element<
    Props = {
      [key: string | symbol | number]: any;
    },
    Type = any,
  > {
    $$typeof: typeof Element;
    type: Type;
    props: Props;
    key: string | number | null;
  }
  export const Fragment: unique symbol;
  export type Fragment = Element<{}, typeof Fragment>;
  export let createElement: {
    <Type extends string | typeof Fragment | ((...args: any) => any)>(
      type: Type,
    ): Element<{}, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends {
        [key: string | number | symbol]: any;
      },
    >(
      type: Type,
      props: Props,
    ): Element<Props, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends {
        [key: string | number | symbol]: any;
      },
      Children extends Array<any>,
    >(
      type: Type,
      props: Props,
      ...children: Children
    ): Element<
      Props & {
        children: Children;
      },
      Type
    >;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Children extends Array<any>,
    >(
      type: Type,
      ...children: Children
    ): Element<
      {
        children: Children;
      },
      Type
    >;
  };
}
```

## JSX.pragma (exported string)

A string containing the expression that should be called to create JSX
elements. yavascript's internals use this string to transpile JSX syntax.

Defaults to "JSX.createElement".

If changed, any JSX code loaded afterwards will use a different
expression.

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing [types.JSX.Element](#)
and [types.JSX.Fragment](#)):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

```ts
let pragma: string;
```

## JSX.pragmaFrag (exported string)

A string containing the expression that should be used as the first
parameter when creating JSX fragment elements. yavascript's internals use
this string to transpile JSX syntax.

Defaults to "JSX.Fragment".

If changed, any JSX code loaded afterwards will use a different
expression.

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing [types.JSX.Element](#)
and [types.JSX.Fragment](#)):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

```ts
let pragmaFrag: string;
```

## JSX.Element (exported value)

```ts
const Element: unique symbol;
```

## JSX.Element (exported interface)

```ts
interface Element<
  Props = {
    [key: string | symbol | number]: any;
  },
  Type = any,
> {
  $$typeof: typeof Element;
  type: Type;
  props: Props;
  key: string | number | null;
}
```

### Element.$$typeof (property)

```ts
$$typeof: typeof Element;
```

### Element.type (Type property)

```ts
type: Type;
```

### Element.props (Props property)

```ts
props: Props;
```

### Element.key (property)

```ts
key: string | number | null;
```

## JSX.Fragment (exported value)

The value which gets passed into the JSX element constructor (as
determined by [JSX.pragma](#)) when JSX fragment syntax is used (unless
[JSX.pragmaFrag](#) is changed).

```ts
const Fragment: unique symbol;
```

## JSX.Fragment (exported type)

```ts
type Fragment = Element<{}, typeof Fragment>;
```

## JSX.createElement (exported function)

The JSX element builder function, which gets invoked whenever JSX syntax is
used (unless [JSX.pragma](#) is changed).

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing [types.JSX.Element](#)
and [types.JSX.Fragment](#)):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

```ts
let createElement: {
  <Type extends string | typeof Fragment | ((...args: any) => any)>(
    type: Type,
  ): Element<{}, Type>;
  <
    Type extends string | typeof Fragment | ((...args: any) => any),
    Props extends {
      [key: string | number | symbol]: any;
    },
  >(
    type: Type,
    props: Props,
  ): Element<Props, Type>;
  <
    Type extends string | typeof Fragment | ((...args: any) => any),
    Props extends {
      [key: string | number | symbol]: any;
    },
    Children extends Array<any>,
  >(
    type: Type,
    props: Props,
    ...children: Children
  ): Element<
    Props & {
      children: Children;
    },
    Type
  >;
  <
    Type extends string | typeof Fragment | ((...args: any) => any),
    Children extends Array<any>,
  >(
    type: Type,
    ...children: Children
  ): Element<
    {
      children: Children;
    },
    Type
  >;
};
```

### createElement(...) (call signature)

```ts
<Type extends string | typeof Fragment | ((...args: any) => any)>(type: Type): Element<{}, Type>;
```

### createElement(...) (call signature)

```ts
<Type extends string | typeof Fragment | ((...args: any) => any), Props extends {
  [key: string | number | symbol]: any;
}>(type: Type, props: Props): Element<Props, Type>;
```

### createElement(...) (call signature)

```ts
<Type extends string | typeof Fragment | ((...args: any) => any), Props extends {
  [key: string | number | symbol]: any;
}, Children extends Array<any>>(type: Type, props: Props, ...children: Children): Element<Props & {
  children: Children;
}, Type>;
```

### createElement(...) (call signature)

```ts
<Type extends string | typeof Fragment | ((...args: any) => any), Children extends Array<any>>(type: Type, ...children: Children): Element<{
  children: Children;
}, Type>;
```
