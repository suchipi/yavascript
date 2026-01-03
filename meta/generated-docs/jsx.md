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

The properties of the `JSX` global can be modified to change how JSX syntax
gets compiled by yavascript. Those properties are:

- `pragma` (string): The JavaScript expression that should be called to
  create JSX elements. Defaults to "JSX.createElement".
- `pragmaFrag` (string): The JavaScript expression that should be used when
  creating JSX fragments. Defaults to "JSX.Fragment".
- `createElement` (function): The function used to create JSX elements,
  unless `JSX.pragma` has been changed.
- `Element` (symbol): used by the default `JSX.createElement` function to
  identify JSX elements.
- `Fragment` (symbol): used by the default `JSX.createElement` function to
  identify JSX fragments. Referenced by the default value for
  `JSX.pragmaFrag`.

Modifying these properties will change how JSX syntax gets compiled.

For instance, to use React for JSX, you could either replace
`JSX.createElement` and `JSX.Fragment` with React's versions:

```ts
import * as React from "npm:react";

JSX.createElement = React.createElement;
JSX.Fragment = React.Fragment;
```

Or, you could change `JSX.pragma` and `JSX.pragmaFrag` to reference React
directly:

```ts
JSX.pragma = "React.createElement";
JSX.pragmaFrag = "React.Fragment";
```

Note however, that changes to `pragma` and `pragmaFrag` will only affect JSX
appearing in files which are loaded _after_ the change, but changing
`createElement` and `Fragment` will affect all JSX syntax appearing after the
change, even within the same file.

Whichever approach you take, you should also update `types.JSX.Element` and
`types.JSX.Fragment` such that the expression `types.JSX.Element(<a />) &&
types.JSX.Fragment(<></>)` is always `true`. To do that for React, you would
do:

```ts
types.JSX.Element = React.isValidElement;
types.JSX.Fragment = (value) => {
  return React.isValidElement(value) && value.type === React.Fragment;
};
```

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

The default value is "JSX.createElement".

If changed, any JSX code loaded afterwards will use a different expression.

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing `types.JSX.Element` and
`types.JSX.Fragment`):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

For more info, including info on how to change how JSX is compiled, see
[JSX](/meta/generated-docs/jsx.md#jsx-namespace).

```ts
let pragma: string;
```

## JSX.pragmaFrag (exported string)

A string containing the expression that should be used as the first
parameter when creating JSX fragment elements. yavascript's internals use
this string to transpile JSX syntax.

Defaults to "JSX.Fragment".

If changed, any JSX code loaded afterwards will use a different expression.

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing `types.JSX.Element` and
`types.JSX.Fragment`):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

For more info, including info on how to change how JSX is compiled, see
[JSX](/meta/generated-docs/jsx.md#jsx-namespace).

```ts
let pragmaFrag: string;
```

## JSX.Element (exported value)

`JSX.Element` is a Symbol. The default implementation of
`JSX.createElement` creates objects whose `$$typeof` property is set to
`JSX.Element`, and type validator functions under the `types.JSX.*`
namespace look for this property in order to determine whether an object is
a JSX element, as created via `JSX.createElement` or JSX syntax.

```jsx
// This gets compiled internally by yavascript into:
// const a = JSX.createElement('a', null);
const a = <a />;

console.log(a);
// {
//   $$typeof: Symbol(JSX.Element)
//   type: "a"
//   props: null
//   key: null
// }

console.log(a.$$typeof === JSX.Element);
// true
```

There is also a TypeScript type called `JSX.Element` which is a type for
the JSX element objects as created by `JSX.createElement` or JSX syntax.

If you modify properties on the JSX global such that the default
implementation of `JSX.createElement` is no longer used (eg. by replacing
it with `React.createElement`), this value may no longer be relevant.
However, the default JSX element object shape is designed to match
React/Preact/etc.

For more info, including info on how to change how JSX is compiled, see
[JSX](/meta/generated-docs/jsx.md#jsx-namespace).

```ts
const Element: unique symbol;
```

## JSX.Element (exported interface)

The TypeScript type for JSX Element objects created by the default
implementation of `JSX.createElement`.

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

`JSX.Fragment` is a Symbol which is used to indicate whether a JSX element
is a JSX fragment.

```jsx
// This gets compiled internally by yavascript into:
// const a = JSX.createElement(JSX.Fragment, null);
const frag = <></>;

console.log(frag);
// {
//   $$typeof: Symbol(JSX.Element)
//   type: Symbol(JSX.Fragment)
//   props: null
//   key: null
// }

console.log(a.type === JSX.Fragment);
// true
```

There is also a TypeScript type called `JSX.Fragment` which is a type for
the JSX fragment element objects as created by `JSX.createElement` or JSX
syntax.

If you modify properties on the JSX global such that `JSX.Fragment` is no
longer used (eg. by replacing it with `React.Fragment`), this value may no
longer be relevant.

For more info, including info on how to change how JSX is compiled, see
[JSX](/meta/generated-docs/jsx.md#jsx-namespace).

```ts
const Fragment: unique symbol;
```

## JSX.Fragment (exported type)

The TypeScript type for JSX Element objects whose type is `JSX.Fragment`,
which is what yavascript creates internally when JSX fragment syntax
(`<></>`) is used.

If you modify properties on the JSX global such that `JSX.Fragment` is no
longer used (eg. by replacing it with `React.Fragment`), this type may no
longer be relevant.

```ts
type Fragment = Element<{}, typeof Fragment>;
```

## JSX.createElement (exported function)

The JSX element builder function, which gets invoked internally by
yavascript whenever JSX syntax is used (unless `JSX.pragma` gets changed by
the user).

Note that if you change this, you need to verify that the following
expression always evaluates to `true` (by changing `types.JSX.Element` and
`types.JSX.Fragment`):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

For more info, including info on how to change how JSX is compiled, see
[JSX](/meta/generated-docs/jsx.md#jsx-namespace).

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
