# `exit` - Exit the yavascript process

Calling `exit` will immediately exit the calling yavascript process.

You may provide an exit status code either at the callsite:

```ts
exit(1);
```

Or ahead of time:

```ts
exit.code = 1;
exit();
```

If you set `exit.code` without calling exit, the code will be used when the process exits normally (ie. when there's no more code/timers/listeners left).

```ts
// Defined in yavascript/src/api/commands/exit
declare function exit(code?: number): never;
declare var exit.code: number;
```

`exit.code` defaults to 0.
