- ["quickjs:context" (namespace)](#quickjscontext-namespace)
  - ["quickjs:context".Context (exported class)](#quickjscontextcontext-exported-class)
    - [Context (constructor)](#context-constructor)
    - [Context.prototype.globalThis (property)](#contextprototypeglobalthis-property)
    - [Context.prototype.eval (method)](#contextprototypeeval-method)

# "quickjs:context" (namespace)

```ts
declare module "quickjs:context" {
  export class Context {
    constructor(options?: {
      date?: boolean;
      eval?: boolean;
      stringNormalize?: boolean;
      regExp?: boolean;
      json?: boolean;
      proxy?: boolean;
      mapSet?: boolean;
      typedArrays?: boolean;
      promise?: boolean;
      bigint?: boolean;
      bigfloat?: boolean;
      bigdecimal?: boolean;
      operators?: boolean;
      useMath?: boolean;
      inspect?: boolean;
      console?: boolean;
      print?: boolean;
      moduleGlobals?: boolean;
      timers?: boolean;
      modules?: {
        "quickjs:std"?: boolean;
        "quickjs:os"?: boolean;
        "quickjs:bytecode"?: boolean;
        "quickjs:context"?: boolean;
        "quickjs:engine"?: boolean;
        "quickjs:encoding"?: boolean;
      };
    });
    globalThis: typeof globalThis;
    eval(code: string): any;
  }
}
```

## "quickjs:context".Context (exported class)

A separate global context (or 'realm') within which code can be executed.

```ts
class Context {
  constructor(options?: {
    date?: boolean;
    eval?: boolean;
    stringNormalize?: boolean;
    regExp?: boolean;
    json?: boolean;
    proxy?: boolean;
    mapSet?: boolean;
    typedArrays?: boolean;
    promise?: boolean;
    bigint?: boolean;
    bigfloat?: boolean;
    bigdecimal?: boolean;
    operators?: boolean;
    useMath?: boolean;
    inspect?: boolean;
    console?: boolean;
    print?: boolean;
    moduleGlobals?: boolean;
    timers?: boolean;
    modules?: {
      "quickjs:std"?: boolean;
      "quickjs:os"?: boolean;
      "quickjs:bytecode"?: boolean;
      "quickjs:context"?: boolean;
      "quickjs:engine"?: boolean;
      "quickjs:encoding"?: boolean;
    };
  });
  globalThis: typeof globalThis;
  eval(code: string): any;
}
```

### Context (constructor)

Create a new global context (or 'realm') within code can be executed.

- `@param` _options_ — Options for what globals/modules/etc to make available within the context.

The following globals are always present, regardless of options:

- Object
- Function
- Error
- EvalError
- RangeError
- ReferenceError
- SyntaxError
- TypeError
- URIError
- InternalError
- AggregateError
- Array
- parseInt
- parseFloat
- isNaN
- isFinite
- decodeURI
- decodeURIComponent
- encodeURI
- encodeURIComponent
- escape
- unescape
- Infinity
- NaN
- undefined
- \_\_date_clock
- Number
- Boolean
- String
- Math
- Reflect
- Symbol
- eval (but it doesn't work unless the `eval` option is enabled)
- globalThis

Note that new contexts don't have a `scriptArgs` global. If you need one
to be present in the new context, you can add one onto the Context's
`globalThis` property.

```ts
constructor(options?: {
  date?: boolean;
  eval?: boolean;
  stringNormalize?: boolean;
  regExp?: boolean;
  json?: boolean;
  proxy?: boolean;
  mapSet?: boolean;
  typedArrays?: boolean;
  promise?: boolean;
  bigint?: boolean;
  bigfloat?: boolean;
  bigdecimal?: boolean;
  operators?: boolean;
  useMath?: boolean;
  inspect?: boolean;
  console?: boolean;
  print?: boolean;
  moduleGlobals?: boolean;
  timers?: boolean;
  modules?: {
    "quickjs:std"?: boolean;
    "quickjs:os"?: boolean;
    "quickjs:bytecode"?: boolean;
    "quickjs:context"?: boolean;
    "quickjs:engine"?: boolean;
    "quickjs:encoding"?: boolean;
  };
});
```

### Context.prototype.globalThis (property)

The `globalThis` object used by this context.

You can add to or remove from it to change what is visible to the context.

```ts
globalThis: typeof globalThis;
```

### Context.prototype.eval (method)

Runs code within the context and returns the result.

- `@param` _code_ — The code to run.

```ts
eval(code: string): any;
```
