# clear (function)

Clear the contents and scrollback buffer of the tty by printing special characters into stdout.

```ts
declare function clear(): void;
```

# Console (interface)

```ts
interface Console {
  clear: typeof clear;
}
```

## Console.clear (property)

Same as [clear](/meta/generated-docs/console.md#clear-function)().

```ts
clear: typeof clear;
```
