- [env (object)](#env-object)
- [readEnvBool (function)](#readenvbool-function)

# env (object)

An object representing the process's environment variables. You can read
from it to read environment variables, write into it to set environment
variables, and/or delete properties from it to unset environment variables.
Any value you write will be coerced into a string.

```ts
const env: {
  [key: string]: string | undefined;
};
```

# readEnvBool (function)

A function which reads an environment variable and returns an appropriate
boolean based on the string value of the environment variable.

- If the environment variable is not set, The `fallback` parameter is returned.
- If the value is "1", "true", "True", or "TRUE", the boolean `true` is returned.
- If the value is "0", "false", "False", or "FALSE", the boolean `false` is returned.
- If the environment variable is defined but its value isn't one of the
  values listed above, a warning is printed and the `fallback` parameter is returned.

Generally, the `fallback` parameter is set to `true`, `false`, or `null`.

- `@param` _key_ — The environment variable to read.
- `@param` _fallback_ — Value to return if the environment variable is unset or not
  coercable to boolean.
- `@param` _logging_ — logger override for the warning printed when an environment
  variable has an unsupported value. Defaults to [logger](/meta/generated-docs/logger.md#logger-object).

```ts
declare function readEnvBool<T>(
  key: string,
  fallback: T,
  logging?: {
    warn?: (...args: Array<any>) => void;
  }
): boolean | T;
```
