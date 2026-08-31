---
hide_title: true
---
## clear (function)

Prints special ANSI escape characters to stdout which instruct your terminal
emulator to clear the screen and clear your terminal scrollback.

Identical to [console.clear](./console.md#consoleclear-method).

```ts
declare function clear(): void;
```

## Console (interface)

```ts
interface Console {
  log(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  clear(): void;
}
```

### Console.log (method)

Logs its arguments to stdout, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](./inspect.md#inspect-inspectfunction).

Functionally identical to [console.info](./console.md#consoleinfo-method), [echo](./echo.md#echo-value), and
[print](./print.md#print-function). Contrast with [console.error](./console.md#consoleerror-method), which prints to stderr
instead of stdout.

```ts
log(message?: any, ...optionalParams: any[]): void;
```

### Console.info (method)

Logs its arguments to stdout, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](./inspect.md#inspect-inspectfunction).

Functionally identical to [console.log](./console.md#consolelog-method), [echo](./echo.md#echo-value), and
[print](./print.md#print-function). Contrast with [console.error](./console.md#consoleerror-method), which prints to stderr
instead of stdout.

```ts
info(message?: any, ...optionalParams: any[]): void;
```

### Console.warn (method)

Logs its arguments to stderr, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](./inspect.md#inspect-inspectfunction).

Functionally identical to [console.error](./console.md#consoleerror-method). Contrast with
[console.log](./console.md#consolelog-method), which prints to stdout instead of stderr.

```ts
warn(message?: any, ...optionalParams: any[]): void;
```

### Console.error (method)

Logs its arguments to stderr, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](./inspect.md#inspect-inspectfunction).

Functionally identical to [console.warn](./console.md#consolewarn-method). Contrast with
[console.log](./console.md#consolelog-method), which prints to stdout instead of stderr.

```ts
error(message?: any, ...optionalParams: any[]): void;
```

### Console.clear (method)

Prints special ANSI escape characters to stdout which instruct your terminal
emulator to clear the screen and clear your terminal scrollback.

Identical to [clear](./console.md#clear-function).

```ts
clear(): void;
```

## console (Console)

```ts
var console: Console;
```
