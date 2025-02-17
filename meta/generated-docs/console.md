# clear (function)

Clear the contents and scrollback buffer of the tty by printing special characters into stdout.

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

Writes to stdout, with newline appended.

```ts
log(message?: any, ...optionalParams: any[]): void;
```

## Console.info (method)

Writes to stdout, with newline appended.

```ts
info(message?: any, ...optionalParams: any[]): void;
```

## Console.warn (method)

Writes to stderr, with newline appended.

```ts
warn(message?: any, ...optionalParams: any[]): void;
```

## Console.error (method)

Writes to stderr, with newline appended.

```ts
error(message?: any, ...optionalParams: any[]): void;
```

## Console.clear (method)

Same as [clear](/meta/generated-docs/console.md#clear-function)().

```ts
clear(): void;
```

# console (Console)

```ts
var console: Console;
```
