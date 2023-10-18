# `JSX` - Control how JSX gets compiled

The properties of the `JSX` global can be modified to change how JSX syntax gets compiled by yavascript. Those properties are:

- `pragma` (string): The JavaScript expression that should be called to create JSX elements. Defaults to "JSX.createElement".
- `pragmaFrag` (string): The JavaScript expression that should be used when creating JSX fragments. Defaults to "JSX.Fragment".
- `createElement` (function): The function used to create JSX elements, unless `JSX.pragma` has been changed.
- `Element` (symbol): used by the default `JSX.createElement` function to identify JSX elements.
- `Fragment` (symbol): used by the default `JSX.createElement` function to identify JSX fragments. Referenced by the default value for `JSX.pragmaFrag`.

Modifying these properties will change how JSX syntax gets compiled.

For instance, to use React for JSX, you could either replace `JSX.createElement` and `JSX.Fragment` with React's versions:

```ts
import * as React from "npm:react";

JSX.createElement = React.createElement;
JSX.Fragment = React.Fragment;
```

Or, you could change `JSX.pragma` and `JSX.pragmaFrag` to reference React directly:

```ts
JSX.pragma = "React.createElement";
JSX.pragmaFrag = "React.Fragment";
```

Note however, that changes to `pragma` and `pragmaFrag` will only affect JSX appearing in files which are loaded _after_ the change, but changing `createElement` and `Fragment` will affect all JSX syntax appearing after the change, even within the same file.

Whichever approach you take, you should also update `types.JSX.Element` and `types.JSX.Fragment` such that `types.JSX.Element(<a />) && types.JSX.Fragment(<></>)` is always `true`:

```ts
types.JSX.Element = React.isValidElement;
types.JSX.Fragment = (value) => {
  return React.isValidElement(value) && value.type === React.Fragment;
};
```

<!-- prettier-ignore-start -->
```ts
// Defined in yavascript/src/api/jsx
declare namespace JSX {
  export let pragma: string;
  export let pragmaFrag: string;

  export let Element: unique symbol;
  export interface Element<
    Props = { [key: string | symbol | number]: any },
    Type = any
  > {
    $$typeof: typeof Element;
    type: Type;
    props: Props;
    key: string | number | null;
  }

  export const Fragment: unique symbol;
  export type Fragment = Element<{}, typeof Fragment>;

  export function createElement(
    type: string | typeof Fragment | Function,
    props?: Object,
    ...children?: Array<any>
  ): JSX.Element;
}
```
<!-- prettier-ignore-end -->
