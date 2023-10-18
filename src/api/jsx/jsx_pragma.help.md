# `JSX.pragma` - The expression called to create JSX elements

`JSX.pragma` is a string containing the expression that should be called to create JSX elements. yavascript's internals use this string to transpile JSX syntax.

The default value is "JSX.createElement".

If changed, any JSX code loaded afterwards will use a different expression.

Note that if you change this, you need to verify that the following expression always evaluates to `true` (by changing `types.JSX.Element` and `types.JSX.Fragment`):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

```ts
// Defined in yavascript/src/api/jsx
declare namespace JSX {
  export let pragma: string;
}
```

For more info, including info on how to change how JSX is compiled, see `help(JSX)`.
