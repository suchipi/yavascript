# print (function)

Print the arguments separated by spaces and a trailing newline.

Non-string args are coerced into a string via [ToString](https://tc39.es/ecma262/#sec-tostring).
Objects can override the default `ToString` behavior by defining a `toString` method.

```ts
var print: (...args: Array<any>) => void;
```

# Console (interface)

Object that provides functions for logging information.

```ts
interface Console {
  log: typeof print;
  warn: typeof print;
  error: typeof print;
  info: typeof print;
}
```

## Console.log (property)

Same as [print](#)().

```ts
log: typeof print;
```

## Console.warn (property)

Same as [print](#)().

```ts
warn: typeof print;
```

## Console.error (property)

Same as [print](#)().

```ts
error: typeof print;
```

## Console.info (property)

Same as [print](#)().

```ts
info: typeof print;
```

# console (Console)

```ts
var console: Console;
```
