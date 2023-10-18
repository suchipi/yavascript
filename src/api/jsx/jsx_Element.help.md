# `JSX.Element` - Symbol used by `JSX.createElement`

`JSX.Element` is a Symbol. The default implementation of `JSX.createElement` creates objects whose `$$typeof` property is set to `JSX.Element`, and type validator functions under the `types.JSX.*` namespace look for this property in order to determine whether an object is a JSX element, as created via `JSX.createElement` or JSX syntax.

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

There is also a TypeScript type called `JSX.Element` which is a type for the JSX element objects as created by `JSX.createElement` or JSX syntax:

```ts
// Defined in yavascript/src/api/jsx
declare interface Element<
  Props = { [key: string | symbol | number]: any },
  Type = any
> {
  $$typeof: typeof JSX.Element;
  type: Type;
  props: Props;
  key: string | number | null;
}
```

For more info, including info on how to change how JSX is compiled, see `help(JSX)`.
