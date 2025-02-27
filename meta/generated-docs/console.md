- [clear (function)](#clear-function)
- [Console (interface)](#console-interface)
  - [Console.log (method)](#consolelog-method)
  - [Console.info (method)](#consoleinfo-method)
  - [Console.warn (method)](#consolewarn-method)
  - [Console.error (method)](#consoleerror-method)
  - [Console.clear (method)](#consoleclear-method)
- [console (Console)](#console-console)

# clear (function)

Prints special ANSI escape characters to stdout which instruct your terminal
emulator to clear the screen and clear your terminal scrollback.

Identical to [console.clear](/meta/generated-docs/console.md#consoleclear-method).

```ts
declare function clear(): void;
```

# Console (interface)

```ts
interface Console {
  log(message?: any, ...optionalParams: any[]): void;
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
  clear(): void;
}
```

## Console.log (method)

Logs its arguments to stdout, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

Functionally identical to [console.info](/meta/generated-docs/console.md#consoleinfo-method), [echo](/meta/generated-docs/echo.md#echo-value), and
[print](/meta/generated-docs/print.md#print-function). Contrast with [console.error](/meta/generated-docs/console.md#consoleerror-method), which prints to stderr
instead of stdout.

```ts
log(message?: any, ...optionalParams: any[]): void;
```

## Console.info (method)

Logs its arguments to stdout, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

Functionally identical to [console.log](/meta/generated-docs/console.md#consolelog-method), [echo](/meta/generated-docs/echo.md#echo-value), and
[print](/meta/generated-docs/print.md#print-function). Contrast with [console.error](/meta/generated-docs/console.md#consoleerror-method), which prints to stderr
instead of stdout.

```ts
info(message?: any, ...optionalParams: any[]): void;
```

## Console.warn (method)

Logs its arguments to stderr, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

Functionally identical to [console.error](/meta/generated-docs/console.md#consoleerror-method). Contrast with
[console.log](/meta/generated-docs/console.md#consolelog-method), which prints to stdout instead of stderr.

```ts
warn(message?: any, ...optionalParams: any[]): void;
```

## Console.error (method)

Logs its arguments to stderr, with a newline appended.

Any value can be logged, not just strings. Non-string values will be
formatted using [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

Functionally identical to [console.warn](/meta/generated-docs/console.md#consolewarn-method). Contrast with
[console.log](/meta/generated-docs/console.md#consolelog-method), which prints to stdout instead of stderr.

```ts
error(message?: any, ...optionalParams: any[]): void;
```

## Console.clear (method)

Prints special ANSI escape characters to stdout which instruct your terminal
emulator to clear the screen and clear your terminal scrollback.

Identical to [clear](/meta/generated-docs/console.md#clear-function).

```ts
clear(): void;
```

# console (Console)

```ts
var console: Console;
```
