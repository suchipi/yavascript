#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

// JSX syntax gets compiled to expressions referencing `JSX.createElement` and
// `JSX.Fragment`, which are both defined as a global. To change how JSX gets
// compiled, change the values of `JSX.pragma` and `JSX.pragmaFrag`.
//
// Note that if you change `JSX.pragma` and/or `JSX.pragmaFrag`, you should
// also update `is.JSX.Element` and `is.JSX.Fragment`. See the `JSX` section in
// `yavascript --print-types` for more information.

console.log(<a />); // { $$typeof: Symbol(JSX.Element), type: "a", props: null, key: null }

console.log(is.JSX.Element(<a />)); // true
console.log(is.JSX.Element(2)); // false

console.log(is.JSX.Fragment(<></>)); // true
console.log(is.JSX.Fragment(<a />)); // false
console.log(is.JSX.Fragment(2)); // false
