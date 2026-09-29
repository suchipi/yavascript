# API audit: `types`, `is`/`_is`, `assert`, `number`/`string`/..., `JSX`

Binary: `./dist/yavascript` (`git-d8cc554c0810`). All commands run from the repo root. Scratch scripts live in `.tmp/gap-update/types/`; TypeScript checks live in `.tmp/gap-update/types/tscheck/` and were run with the repo's `tsc` 7.0.2 (`./node_modules/.bin/tsc`) and cross-checked with `meta/website/node_modules/.bin/tsc` 6.0.3 (same errors).

`pheno` (1.13.1) is bundled from `node_modules/pheno`; several root causes live there, so line refs point into `node_modules/pheno/dist/cjs/...`.

## Findings

### 1. bug (types) - `is`/`assert.type` narrow to the wrong TypeScript type for objects, arrays, classes, BigInt, Symbol

- API: `CoerceToTypeValidator`, `UnwrapTypeFromCoerceableOrValidator`, `is`, `assert.type`, `types.coerce`, `types.arrayOf`, etc.
- Repro: `cd .tmp/gap-update/types/tscheck && ../../../../node_modules/.bin/tsc --noEmit -p tsconfig.show.json` (file `show-types.ts`), plus `tsconfig.json` with `narrowing.ts`.
- Actual narrowed types (expected in parentheses):
  - `is(w, BigInt)` -> `BigInt` wrapper interface (`bigint`); `u + 1n` then errors with TS2365
  - `is(w, Symbol)` -> `Symbol` wrapper interface (`symbol`)
  - `is(w, { a: Number })` -> `{ a: TypeValidator<number> }` (`{ a: number }`); `u.a + 1` errors with TS2365
  - `is(w, [Number])` -> `[TypeValidator<number>]` (`number[]`; runtime accepts any length)
  - `is(w, [Number, String])` -> `[TypeValidator<number>, TypeValidator<string>]`
  - `is(w, Foo)` (user class) -> `{ prototype: TypeValidator<{ x: TypeValidator<number> }> }` (`Foo`)
  - `is(w, Path)` / `is(w, Error)` / `is(w, Promise)` -> large unusable mapped types
  - `types.arrayOf({ a: String })` -> `{ a: TypeValidator<string> }[]`; `types.coerce({ a: Number })` -> `TypeValidator<{ a: TypeValidator<number> }>`
- Cause: in `CoerceToTypeValidator` (`src/layer1/api/types/types.inc.d.ts:1443-1524`, copied at `src/layer1/api/types/types.ts:10-91`) the `V extends {}` branch (line 1496) comes before the array and `new (...args) => any` branches, so those are unreachable, and it maps each key to `CoerceToTypeValidator<V[key]>` (a validator type) instead of the unwrapped value type. BigInt/Symbol use `TypeValidator<BigInt>`/`TypeValidator<Symbol>` (lines 1450-1453) instead of `bigint`/`symbol`.
- Working correctly: `String`, `Number`, `Boolean`, `Date`, `Map`, literal primitives, `null`, `undefined`, RegExp, and every `types.*` validator/constructor that takes validators (`types.or(String, Number)`, `types.objectWithProperties({ a: Number })`, `types.maybe(String)`, `types.record`, `types.tuple`, `types.mapOf`, `types.setOf`).

### 2. bug (types) - JSX in `.tsx` doesn't typecheck against `yavascript.d.ts`

- API: `JSX` namespace types
- Repro: `cd .tmp/gap-update/types/tscheck && ../../../../node_modules/.bin/tsc --noEmit -p tsconfig.preserve.json` (file `jsx-check.tsx`, `strict`, `jsx: preserve`); `tsconfig.json` uses `jsx: react` + `jsxFactory: JSX.createElement` + `jsxFragmentFactory: JSX.Fragment`.
- Actual:
  - `TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.` on every `<div>`/`<p>`. `grep IntrinsicElements yavascript.d.ts` finds nothing.
  - `const a: JSX.Element = <div id="x">hi</div>` -> `TS2322: Type 'Element<Props, Type>' is not assignable to type 'Element<{ [key: string]: any; ... }, any>'`. Same for `const f: JSX.Fragment = <>x</>`.
  - With `jsxFragmentFactory: JSX.Fragment`, `<>x</>` -> `TS2604: JSX element type '<>' does not have any construct or call signatures.`
- Cause: `JSX.Element` is a generic interface (`src/layer1/api/jsx/jsx.inc.d.ts:146-154`), so TS uses it uninstantiated as the type of JSX expressions; no `IntrinsicElements`/`ElementChildrenAttribute` is declared. The docs also never say which tsconfig JSX settings to use.

### 3. doc-mismatch + bug - `types.optional` is documented but untyped, and it doesn't coerce

- API: `types.optional`
- Repro: `./dist/yavascript -e '[types.optional(String)(42), types.optional(String)(""), types.optional(types.string)(undefined)]'` and `./dist/yavascript -e 'types.optional({ a: Number })'`
- Expected: `optional` is in the "Type Validator Constructors" list (`src/layer1/api/types/types.inc.d.ts:161`), and the docs say "All type constructors ... do coercion automatically!" (line 219). So expected `[false, false, true]` and a working validator.
- Actual: `[true, false, true]` (`String` is called as a validator: `String(42)` is truthy, `String("")` is falsy), and `types.optional({ a: Number })` throws `TypeError: Expected value of type anyTypeValidator, but received {"a":"<Function Number>"}`. In TS, `types.optional` is `TS2339: Property 'optional' does not exist` (`tscheck/narrowing.ts:12`).
- Cause: pheno's `optional` isn't in `$CoercingTypeConstructors` (`node_modules/pheno/dist/cjs/coerce/coerce.js:199-224`), and the `types` type in `types.inc.d.ts:223-1439` doesn't declare it.

### 4. doc-mismatch - the listed validators and the typed/runtime `types` object disagree

- API: `types`
- Repro: `./dist/yavascript -e '[typeof types.objectStr, typeof types.objectOrNull, typeof types.anyTypeValidator, typeof types.unknownTypeValidator]'` -> all `"function"`; `tscheck/narrowing.ts:13-15` gives TS2339 for `objectOrNull`, `anyTypeValidator`, `unknownTypeValidator`.
- Details:
  - Listed in docs and present at runtime, but missing from the TS type: `objectOrNull` (`types.inc.d.ts:104`), `anyTypeValidator` (74), `unknownTypeValidator` (120), `optional` (161).
  - Typed and present, but missing from the doc lists: `tuple`, `coerce`.
  - Present at runtime but neither typed nor a validator: `types.objectStr` (pheno's internal string helper, leaked by `...$TypeConstructors` at `src/layer1/api/types/types.ts:1375`).

### 5. doc-mismatch - "Empty array -> Validator for empty arrays" is false

- API: `types.coerce`, `is`, `assert.type`
- Repro: `./dist/yavascript -e '[is([1, 2, 3], []), types.coerce([]).name]'`
- Expected per the coercion table (`src/layer1/api/types/types.inc.d.ts:202`): `false`.
- Actual: `[true, "arrayOfAny"]`. `[]` matches any array (`node_modules/pheno/dist/cjs/coerce/coerce.js:84-85`). The TS type (`V extends [] ? TypeValidator<[]>`) says empty tuple, so TS and runtime disagree.

### 6. doc-mismatch - `JSX.createElement` typings don't match the implementation

- API: `JSX.createElement`, `JSX.Element` type
- Repro: `./dist/yavascript -e '[JSX.createElement("a", "child").props, JSX.createElement("a").props]'` -> `["child", undefined]`
- Details:
  - The 4th overload `(type, ...children) => Element<{ children: Children }, Type>` (`src/layer1/api/jsx/jsx.inc.d.ts:243-249`) typechecks (`tscheck/jsx-check.tsx:8-9`) but isn't implemented: the first child becomes `props`.
  - The 1-arg overload returns `Element<{}, Type>` (line 221-224), but runtime `props` is `undefined` (or `null` for `<a />`, as the doc example itself shows). TS lets you read `el.props.x` on something that is `null` at runtime.
  - The `Fragment` doc example logs `a.type === JSX.Fragment` but the variable is `frag` (line 174), and its comment says `const a = ...` (line 163).

### 7. rough-edge - `assert.type` failure messages don't help locate nested failures

- API: `assert.type`
- Repro: `./dist/yavascript -e 'try { assert.type({ servers: [{ host: "a", tags: ["x"] }, { host: "b", tags: ["y", 42] }] }, { servers: [{ host: String, tags: [String] }] }) } catch (e) { e.message }'`
- Actual: `Expected value of type objectWithProperties({ servers: arrayOf(objectWithProperties({ host: string, tags: arrayOf(string) })) }), but received {"servers":[...full value...]}`. No path such as `servers[1].tags[1]`.
- Related:
  - Message length is unbounded: `./dist/yavascript -e 'try { assert.type(Array.from({ length: 10000 }, (_, i) => i), String) } catch (e) { e.message.length }'` -> `48935`. By contrast, `assert()` caps at 1000 (`src/layer1/error-with-properties.ts:3`).
  - Values are rendered through `toJSON`, which is misleading: `assert.type(new Path("/x"), String)` -> `Expected value of type string, but received "/x"`, and a `Date` renders as `"1970-01-01T00:00:00.000Z"`. Both look like the expected string.
  - Validator names can be confusing: `types.any` reports as `unknown` (`types.any.name === "unknown"`, pheno bug at `node_modules/pheno/dist/cjs/basic-types.js:11`); `Path` coerces to a validator named `isPath`; `Array`/`Object`/`Set` report `anyArray`/`anyObject`/`anySet` although the coercion table names `arrayOfUnknown`/`unknownObject`/`unknownSet`.

### 8. rough-edge - `assert` and `assert.type` behave inconsistently, and neither documents its error

- API: `assert`, `assert.type`
- Repro: `./dist/yavascript -e 'const r = []; try { assert(0) } catch (e) { r.push(e.constructor.name, "value" in e) } try { assert.type(0, String) } catch (e) { r.push(e.constructor.name, "value" in e) } try { assert.type(0, String, "") } catch (e) { r.push(JSON.stringify(e.message)) } r'`
- Actual: `["Error", true, "TypeError", false, "\"\""]`.
  - `assert` throws `Error` with a `.value` property and a code frame. `assert.type` throws `TypeError` with no `.value` and no location.
  - `assert(0, "")` falls back to "Assertion failed", but `assert.type(0, String, "")` throws a `TypeError` with an empty message.
  - Neither docblock (`src/layer1/api/assert/assert.inc.d.ts`) says what error class is thrown or that `.value` exists.
  - `assert.type`'s docblock documents `@param message`, but the parameter is named `optionalMessage` (line 20 vs 25).
  - Both errors' `fileName`/`lineNumber`/`columnNumber` point into yavascript internals (`yavascript-internals/dist/bundles/layer1.js`: `makeErrorWithProperties` for `assert`, pheno's `assertType` for `assert.type`), and so do the top two stack frames. See `./dist/yavascript .tmp/gap-update/types/07-assert-file.ts`.

### 9. rough-edge - `assert` message truncation cuts through the code frame

- API: `assert`
- Repro: `./dist/yavascript .tmp/gap-update/types/16-assert-long.js`
- Actual: with a ~910-char message, `e.message.length` is `1000` and it ends partway through the code frame's divider line (`...16-assert-long.js:2:9\n──┬────...`). The code frame and the `(value = false)` suffix are lost. With colors on (`CLICOLOR_FORCE=1`) the cut lands inside a red span, so the reset code is dropped too (`src/layer1/error-with-properties.ts:35-37`). A non-string message renders as `[object Object]`.

### 10. question - several validators are duck-typed and easy to spoof

- API: `types.Date`, `types.RegExp`, `types.ArrayBuffer`, `types.DataView`, typed-array validators, `types.anyMap`/`anySet`, `types.Error`
- Repro: `./dist/yavascript -e 'const d = { [Symbol.toStringTag]: "Date" }; [is(d, Date), is({ [Symbol.toStringTag]: "Uint8Array" }, Uint8Array), is({ name: "E", message: "m", stack: "s" }, types.Error)]'` -> `[true, true, true]`. `is(d, Date)` then `d.getTime()` throws `not a function`.
- Notes:
  - `types.Uint8Array` accepts the fake, but `types.TypedArray` rejects it (it uses `ArrayBuffer.isView`), so the two are inconsistent.
  - An object with `constructor.name === "Map"`, an `entries` method and a numeric `size` passes `Map`, then `types.mapOf(...)` throws `not a function` on it (`.tmp/gap-update/types/04-cross-realm.js`).
  - This is presumably deliberate for cross-realm support (cross-realm Date/RegExp/Map/Set/Error/typed arrays all pass, verified with `new Context()`). Labeled a question because the docs don't say these are structural checks, and TS narrows to the real class.

### 11. rough-edge - objects used as types are matched loosely

- API: `is`/`assert.type` object coercion, `types.objectWithProperties`
- Repro: `./dist/yavascript -e '[is({}, new Date()), is({}, new Map([[1, 2]])), is([], {})]'` -> `[true, true, true]`
- Notes:
  - A class instance passed as a "type" becomes a shape of its own enumerable props, so for `Date`/`Map` any object matches.
  - Arrays count as objects; `types.objectWithProperties({ length: Number })([])` -> `true`.
  - Inherited props satisfy shapes (`types.objectWithProperties({ a: Number })(Object.create({ a: 1 }))` -> `true`).
  - Functions never match shapes: `is(function f() {}, { name: String })` -> `false`.
  - `types.objectWithOnlyTheseProperties` can't express optional keys: `types.objectWithOnlyTheseProperties({ a: types.optional(types.number) })({})` -> `false`.
  - `types.objectWithProperties("notanobject")` is accepted and builds a validator from the string's characters, and `types.objectWithProperties(null)` throws `TypeError: cannot convert to object` (the coercing wrapper runs `Object.entries` before pheno validates the argument).

### 12. rough-edge - `types.exactNumber(NaN)` never matches

- API: `types.exactNumber`
- Repro: `./dist/yavascript -e '[types.exactNumber(NaN)(NaN), is(NaN, NaN)]'` -> `[false, true]`
- Cause: `exactNumber` accepts NaN as an argument but compares with `===` (`node_modules/pheno/dist/cjs/type-constructors.js:78-84`). Coercing `NaN` goes to `types.NaN`, so only direct use is affected.

### 13. rough-edge - the JSX element shape differs from React's in ways the docs gloss over

- API: `JSX.createElement`, `types.JSX.*`
- Docs: "the default JSX element object shape is designed to match React/Preact/etc." (`src/layer1/api/jsx/jsx.inc.d.ts:133-134`)
- Repro:
  - `./dist/yavascript -e 'JSX.createElement("a", { key: 1, id: 2 })'` -> `props: { key: 1, id: 2 }, key: 1`. `key` stays in `props` and isn't stringified; React removes it and stringifies it. The TS type says `key: string | number | null`.
  - `./dist/yavascript -e 'const p = { id: 1 }; JSX.createElement("a", p, "c"); p'` -> `{ id: 1, children: ["c"] }`. The caller's props object is mutated (`src/layer1/api/jsx/jsx.ts:12-15`).
  - A single child is still wrapped in an array (`<a>hi</a>` -> `children: ["hi"]`). That matches the TS type but not React.
  - `./dist/yavascript -e 'const ctx = new Context({ yavascriptGlobals: true }); const el = ctx.eval("JSX.createElement(\"a\", null)"); [types.JSX.Element(el), ctx.globalThis.JSX.Element === JSX.Element]'` -> `[false, false]`. `JSX.Element`/`JSX.Fragment` are realm-local `Symbol(...)` (`jsx.ts:1-2`), so elements made in a `Context` fail `types.JSX.*`. React uses `Symbol.for`.

### 14. question - per-file `@jsx` / `@jsxFrag` pragma comments are ignored

- API: JSX compilation
- Repro: `./dist/yavascript .tmp/gap-update/types/17-jsx-comment-pragma.jsx` (file starts with `/** @jsx h */`) -> element built with `JSX.createElement` (`$$typeof: Symbol(JSX.Element)`), not `h`.
- The docs only promise `JSX.pragma`/`pragmaFrag`, so this is not a mismatch. It matters because TS users often set `@jsx` per file, and then TS and runtime disagree silently.

### 15. rough-edge - a forgotten type argument silently checks for `undefined`

- API: `is`, `assert.type`
- Repro: `./dist/yavascript -e '[is(undefined), is(5)]'` -> `[true, false]`. `assert.type(undefined)` passes, and `assert.type("x")` fails with `Expected value of type undefined`. TS flags the missing argument; plain JS doesn't.

### 16. gap - validators a 1.0 user would expect are missing

- Not in the `types` declaration (grepped `yavascript.d.ts`) and not at runtime: `Promise` (or thenable), `WeakMap`, `WeakSet`, `BigInt64Array`, `BigUint64Array`, `Float16Array`. Their constructors also can't be used as types, because pheno's class detection doesn't recognize them.
- `types.TypedArray` accepts `BigInt64Array`/`BigUint64Array`/`Float16Array` at runtime (`./dist/yavascript -e 'types.TypedArray(new BigInt64Array(1))'` -> `true`), but its TS type and the global `TypedArray` type only list the nine classic arrays.
- `types.falsy` is typed `false | null | undefined | "" | 0` but accepts `0n` (and NaN) at runtime.
- There's no way to validate a function or class by shape (finding 11). Workarounds exist: `types.instanceOf(Promise)`, `types.hasToStringTag("Promise")`, `types.instanceOf(ChildProcess)` all work.

### 17. gap - `types` members and the `number`/`string`/... aliases have no per-item docs

- `meta/generated-docs/types.md` renders every `types.*` member as a bare signature. The semantics are undocumented: `Error`/`anyMap`/`anySet`/`Date` are structural, `number` excludes NaN/Infinity (only mentioned in the name list), `objectWithProperties` allows extra and inherited props, `record` checks all own keys including symbols, and `integer`, `hasClassName`, `hasToStringTag`, `stringMatching` (unanchored) and `tuple` are unexplained.
- The `types (object)` section also inlines the full ~1,400-line declaration, including 9 overloads each for `and`/`intersection`/`or`/`union`/`tuple`.
- `number`, `string`, `boolean`, `bigint`, `symbol` are explained only by a `//` comment (`src/layer1/api/others/others.inc.d.ts:21`), so `meta/generated-docs/others.md` shows just `var number: NumberConstructor;`. The same file declares `interface ErrorOptions { [key: string]: any; }` with no explanation.
- `is.inc.d.ts:43-46` shows a stale signature, `declare function is(value: any, type: TypeValidator<any>): boolean;`, "Defined in yavascript/src/api/is". The real path is `src/layer1/api/is`, and the real signature is generic with a type predicate.

## Verified working

- Primitives: `types.string/number/boolean/bigint/symbol/null/undefined/nullish/void/true/false/NaN/Infinity/NegativeInfinity/integer/numberIncludingNanAndInfinities` behave as named. `number` rejects NaN/Infinity/-Infinity and boxed numbers, and accepts `-0` and `2**53+2`. Boxed primitives are rejected by `String`/`Number`/`Boolean`/`BigInt`/`Symbol`.
- `types.truthy`/`falsy`/`nonNullOrUndefined`/`any`/`unknown`/`never`/`anyObject`/`objectOrNull`/`anyFunction` (async, generator and class functions count as functions).
- `is` returns a real boolean.
- Coercion of `String`, `Number`, `Boolean`, `BigInt`, `Symbol`, `RegExp`, `Array`, `Set`, `Map`, `Object`, `Date`, `Function`, `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, the nine classic typed arrays, `Path`, `null`, `undefined`, `true`, `false`, `NaN`, `Infinity`, `-Infinity`, strings, numbers (`is(0, -0)` is true), symbols, bigints, regexps (unanchored), 1-item arrays (arrayOf), multi-item arrays (exact-length tuple), plain objects (non-exact shape), and user-defined `class` syntax including subclasses and `Object.create(Klass.prototype)`.
- Constructors: `and`/`intersection`, `or`/`union` (any arity at runtime), `arrayOf`, `tuple`, `mapOf`, `setOf`, `maybe` (null and undefined), `objectWithProperties`, `objectWithOnlyTheseProperties` (rejects extra string, symbol and non-enumerable keys), `partialObjectWithProperties` (missing, null and undefined allowed), `record`/`mappingObjectOf` with string keys and regexp keys, `exactString/Number/BigInt/Symbol`, `symbolFor`, `stringMatching` (fresh RegExp per call, so `/g` and `/y` are safe), `hasClassName`, `hasToStringTag`, and `instanceOf`, including `Symbol.hasInstance` objects. Bad arguments to `exact*`, `stringMatching` and `instanceOf` throw clear TypeErrors.
- `types.FILE` (`std.out` true, `{}` false), `types.Path`, cross-realm `Path` (via `Context({ yavascriptGlobals: true })`), and accessing the `FILE` global throws a helpful error.
- Cross-realm (`new Context()`): arrays, plain objects, Date, RegExp, Map, Set, Error, Uint8Array, ArrayBuffer, functions, and classes defined inside the context all validate correctly.
- Proxies of arrays, objects, Dates and Maps pass the corresponding validators.
- All doc examples in `types.inc.d.ts` and `is.inc.d.ts` produce the documented results (`.tmp/gap-update/types/14-doc-examples.js`), except the coercion-table row noted in finding 5 and the validator names noted in finding 7.
- `assert(value, message)`: falsy values (`0`, `-0`, `0n`, `NaN`, `""`, `null`, `undefined`, `false`) throw and truthy values (`[]`, `{}`, `"0"`) pass. It throws `Error` with a `.value` property, uses the "Assertion failed" default, and prints a correctly source-mapped code frame for `.js`, `.ts` and `.coffee` callers.
- `assert.type` throws `TypeError`, uses a custom message when given one, and falls back to the default when the message is `null`. With colors off, neither `assert` nor `assert.type` writes ANSI escapes.
- TS: `assert(c)` narrows `string | null` to `string`. `assert.type(x, String)` and `assert.type(x, String, "msg")` narrow `unknown` to `string`. `_is` narrows like `is`.
- `number === Number`, `string === String`, `boolean === Boolean`, `bigint === BigInt`, `symbol === Symbol`. All are non-enumerable, configurable and reassignable globals, and callable as functions or constructors.
- JSX in `.jsx`, `.tsx` and `.civet` files, and in `-e` with `--lang jsx`:
  - The element shape matches the doc example (`props: null` for `<a />`, `type: Symbol(JSX.Fragment)` for `<></>`).
  - Children, spread props and function components as `type` all work.
  - `types.JSX.Element(<a />) && types.JSX.Fragment(<></>)` is `true`.
  - `types.JSX.unknownElement`/`anyElement`/`Element`/`Fragment` reject non-elements.
  - Changing `JSX.pragma`/`pragmaFrag` affects only files loaded afterwards, while replacing `JSX.createElement` affects the same file immediately, both as documented.
  - `types.JSX.Element` is reassignable.
- `_is` works in Civet (`_is(x, Number)`), and `_is === globalThis.is`.

## Test coverage notes

Existing tests in this area pass (`npm test -- assert others fixture-scripts is.test`: 5 files, 49 tests; log at `.tmp/gap-update/types/existing-tests.log`). Coverage is thin:

- `is.test.ts` covers only symbol-keyed shapes, array holes, `record` with `Number` keys, and the boolean-ness of `is`. No other tests exercise individual `types.*` validators or constructors. Nothing covers NaN/Infinity handling, `maybe`/`optional`, `mapOf`/`setOf`, `hasClassName`/`hasToStringTag`, `types.FILE`, or `types.Path`.
- The coercion table is untested beyond `String`/`Number`/literals/one user class and the array and object shapes in `is.test.ts`.
- There are no TypeScript narrowing tests. `dts.test.ts` doesn't typecheck any usage of `is`/`assert.type`/JSX against `yavascript.d.ts`, so findings 1 and 2 are invisible. The `.tsx` fixtures run but are never typechecked. Checking `meta/tests/fixtures/scripts/some-tsx.tsx` with `strict` (`tsc -p .tmp/gap-update/types/tscheck/tsconfig.fixture.json`) gives TS7026 on lines 12, 14 and 18.
- `assert.type` tests cover only top-level primitive and class failures. Nothing covers nested shapes, message length, custom-message edge cases (`""`), or the error's missing `.value`.
- `assert` message truncation (finding 9) is untested.
- JSX tests cover `<a />`, `<></>` and the validators (`some-jsx.jsx`, `some-tsx.tsx`), plus one nested element with a `key` in `eval.test.ts`. Props mutation, `JSX.pragma`/`pragmaFrag` changes, `JSX.createElement` replacement, the direct `createElement` overloads, and cross-realm elements are all untested.
- `others.test.ts` only checks identity (`number === Number` etc.).
