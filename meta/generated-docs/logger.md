# logger (object)

The logger used internally by yavascript API functions such as [which](#),
[exec](#), [copy](#), [glob](#), and more.

You can modify the properties on this object in order to configure the
amount and style of log output from yavascript API functions.

This object behaves similarly to the shell builtin `set -x`.

```ts
const logger: {
  trace: (...args: Array<any>) => void;
  info: (...args: Array<any>) => void;
};
```

## logger.trace (function property)

This property is used as the default value for `trace` in yavascript API
functions which receive `logging.trace` as an option, like [which](#),
[exec](#), [copy](#) and [glob](#).

The default value of `logger.trace` is a no-op function.

```ts
trace: (...args: Array<any>) => void;
```

## logger.info (function property)

This property is used as the default value for `info` in yavascript API
functions which receive `logging.info` as an option, like [exec](#),
[copy](#), and [glob](#).

The default value of `logger.info` writes dimmed text to stdout.

```ts
info: (...args: Array<any>) => void;
```
