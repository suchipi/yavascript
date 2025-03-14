- [JSX (namespace)](#jsx-namespace)
  - [JSX.pragma (exported string)](#jsxpragma-exported-string)
  - [JSX.pragmaFrag (exported string)](#jsxpragmafrag-exported-string)
  - [JSX.Element (exported value)](#jsxelement-exported-value)
  - [JSX.Element (exported interface)](#jsxelement-exported-interface)
    - [Element.$$typeof (property)](#elementtypeof-property)
    - [Element.type (Type property)](#elementtype-type-property)
    - [Element.props (Props property)](#elementprops-props-property)
    - [Element.key (property)](#elementkey-property)
  - [JSX.Fragment (exported value)](#jsxfragment-exported-value)
  - [JSX.Fragment (exported type)](#jsxfragment-exported-type)
  - [JSX.createElement (exported function)](#jsxcreateelement-exported-function)
    - [createElement(...) (call signature)](#createelement-call-signature)
    - [createElement(...) (call signature)](#createelement-call-signature-1)
    - [createElement(...) (call signature)](#createelement-call-signature-2)
    - [createElement(...) (call signature)](#createelement-call-signature-3)

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
    Type = any
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
      type: Type
    ): Element<{}, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends {
        [key: string | number | symbol]: any;
      }
    >(
      type: Type,
      props: Props
    ): Element<Props, Type>;
    <
      Type extends string | typeof Fragment | ((...args: any) => any),
      Props extends {
        [key: string | number | symbol]: any;
      },
      Children extends Array<any>
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
      Children extends Array<any>
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
expression always evaluates to `true` (by changing [types.JSX.Element](/meta/generated-docs/types.md#typesjsxelement-property)
and [types.JSX.Fragment](/meta/generated-docs/types.md#typesjsxfragment-property)):

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
expression always evaluates to `true` (by changing [types.JSX.Element](/meta/generated-docs/types.md#typesjsxelement-property)
and [types.JSX.Fragment](/meta/generated-docs/types.md#typesjsxfragment-property)):

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
  Type = any
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
determined by [JSX.pragma](/meta/generated-docs/jsx.md#jsxpragma-exported-string)) when JSX fragment syntax is used (unless
[JSX.pragmaFrag](/meta/generated-docs/jsx.md#jsxpragmafrag-exported-string) is changed).

```ts
const Fragment: unique symbol;
```

## JSX.Fragment (exported type)

```ts
type Fragment = Element<{}, typeof Fragment>;
```

## JSX.createElement (exported function)

The JSX element builder function, which gets invoked whenever JSX syntax is
used (unless [JSX.pragma](/meta/generated-docs/jsx.md#jsxpragma-exported-string) is changed).

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing [types.JSX.Element](/meta/generated-docs/types.md#typesjsxelement-property)
and [types.JSX.Fragment](/meta/generated-docs/types.md#typesjsxfragment-property)):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

```ts
let createElement: {
  <Type extends string | typeof Fragment | ((...args: any) => any)>(
    type: Type
  ): Element<{}, Type>;
  <
    Type extends string | typeof Fragment | ((...args: any) => any),
    Props extends {
      [key: string | number | symbol]: any;
    }
  >(
    type: Type,
    props: Props
  ): Element<Props, Type>;
  <
    Type extends string | typeof Fragment | ((...args: any) => any),
    Props extends {
      [key: string | number | symbol]: any;
    },
    Children extends Array<any>
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
    Children extends Array<any>
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
