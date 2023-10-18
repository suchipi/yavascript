# `JSX.Fragment` - Symbol used by `JSX.pragmaFrag`

`JSX.Fragment` is a Symbol which is used to indicate whether a JSX element is a JSX fragment.

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

There is also a TypeScript type called `JSX.Fragment` which is a type for the JSX fragment element objects as created by `JSX.createElement` or JSX syntax:

```ts
// Defined in yavascript/src/api/jsx
declare type Fragment = {
  $$typeof: typeof JSX.Element;
  type: typeof JSX.Fragment;
  props: {};
  key: string | number | null;
};
```

For more info, including info on how to change how JSX is compiled, see `help(JSX)`.
