`env` - Read/write environment variables

An object representing the process's environment variables. You can read from it to read environment variables, write into it to set environment variables, and/or delete properties from it to unset environment variables. Any value you write will be coerced into a string.

```ts
// Defined in yavascript/src/api/env
declare const env: { [key: string]: string | undefined };
```
