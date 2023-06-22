`$` - Run system command and return stdout/stderr

`$(...)` is an alias for `exec(..., { captureOutput: true, failOnNonZeroStatus: true })`. It's often used to capture the output of a program:

```ts
const result = $(`echo hi`).stdout;
// result is 'hi\n'
```

For more info, see `help(exec)`.

```ts
// Defined in yavascript/src/api/exec
declare function $(args: string | Array<string>);
```
