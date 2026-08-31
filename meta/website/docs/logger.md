---
hide_title: true
---
## logger (object)

The logger used internally by yavascript API functions such as [which](./which.md#which-function),
[exec](./exec.md#exec-interface), [copy](./filesystem.md#copy-function), [glob](./glob.md#glob-function), and more.

You can modify the properties on this object in order to configure the
amount and style of log output from yavascript API functions.

This object behaves similarly to the shell builtin `set -x`.

```ts
const logger: {
  trace: (...args: Array<any>) => void;
  info: (...args: Array<any>) => void;
  warn: (...args: Array<any>) => void;
};
```

### logger.trace (function property)

This property is used as the default value for `trace` in yavascript API
functions which receive `logging.trace` as an option, like [which](./which.md#which-function),
[exec](./exec.md#exec-interface), [copy](./filesystem.md#copy-function) and [glob](./glob.md#glob-function).

The default value of `logger.trace` is a no-op function.

```ts
trace: (...args: Array<any>) => void;
```

### logger.info (function property)

This property is used as the default value for `info` in yavascript API
functions which receive `logging.info` as an option, like [exec](./exec.md#exec-interface),
[copy](./filesystem.md#copy-function), and [glob](./glob.md#glob-function).

The default value of `logger.info` writes dimmed text to stderr.

```ts
info: (...args: Array<any>) => void;
```

### logger.warn (function property)

This property is used as the default value for `warn` in yavascript API
functions which receive `logging.warn` as an option, like [readEnvBool](./env.md#readenvbool-function).

The default value of `logger.warn` writes yellow text to stderr.

```ts
warn: (...args: Array<any>) => void;
```
