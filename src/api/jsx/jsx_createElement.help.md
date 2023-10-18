# `JSX.createElement` - The function used to create JSX elements

The JSX element builder function, which gets invoked whenever JSX syntax is used (unless `JSX.pragma` is changed).

Note that if you change this, you need to verify that the following expression always evaluates to `true` (by changing `types.JSX.Element` and `types.JSX.Fragment`):

```jsx
types.JSX.Element(<a />) && types.JSX.Fragment(<></>);
```

Failure to uphold this guarantee indicates a bug.

<!-- prettier-ignore-start -->
```ts
// Defined in yavascript/src/api/jsx
declare namespace JSX {
  export function createElement(
    type: string | typeof Fragment | Function,
    props?: Object,
    ...children?: Array<any>
  ): JSX.Element;
}
```
<!-- prettier-ignore-end -->

For more info, including info on how to change how JSX is compiled, see `help(JSX)`.
