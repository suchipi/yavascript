- [echo (value)](#echo-value)

# echo (value)

Print one or more values to stdout.

Provides the same functionality as the shell builtin of the same name.

> NOTE: This can print any value, not just strings.

`echo` is functionally identical to `console.log`.

**Example**

```ts
echo("hello", 42, { some: "object" });
```

```ts
const echo: typeof console.log;
```
