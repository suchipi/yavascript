#!/usr/bin/env yavascript
/// <reference path="../../../yavascript.d.ts" />

// JSX syntax gets compiled to expressions referencing `JSX.createElement` and
// `JSX.Fragment`, which are both defined as a global. To change how JSX gets
// compiled, change the values of `JSX.pragma` and `JSX.pragmaFrag`.
//
// Note that if you change `JSX.pragma` and/or `JSX.pragmaFrag`, you should
// also update `types.JSX.Element` and `types.JSX.Fragment`. See the `JSX` section in
// `yavascript --print-types` for more information.

console.log(<a />); // { $$typeof: Symbol(JSX.Element), type: "a", props: null, key: null }

console.log(is(<a />, types.JSX.Element)); // true
console.log(is(2, types.JSX.Element)); // false

console.log(is(<></>, types.JSX.Fragment)); // true
console.log(is(<a />, types.JSX.Fragment)); // false
console.log(is(2, types.JSX.Fragment)); // false
