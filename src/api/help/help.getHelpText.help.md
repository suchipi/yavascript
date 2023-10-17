# `help.getHelpText` - Get the help text associated with a value, if any

If you are wrapping a function and would like to preserve its help text, you may wish to use `help.getHelpText`:

```ts
// Defined in yavascript/src/api/help
declare function help.getHelpText(value: object): string | null;
```

For example, when wrapping `console.log` with your own function:

```ts
const logHistory = [];

const originalLog = console.log;
function myLog(...args: Array<any>) {
  originalLog(...args);
  logHistory.push(args);
}

const consoleLogHelpText = help.getHelpText(console.log);
if (consoleLogHelpText != null) {
  help.setHelpText(myLog, consoleLogHelpText);
}
console.log = myLog;
```

Note that `getHelpText` returns `null` when there is no help text registered for that value.

See also `help(help)`.
