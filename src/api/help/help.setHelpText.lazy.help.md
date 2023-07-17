`help.setHelpText.lazy` - Lazily registers the help text associated with a value

Lazily sets the help text for the provided value using the provided string-returning function.

The first time help text is requested for the value, the string-returning function will be called, and its result will be registered as the help text for the value. Afterwards, the function will not be called again; instead, it will re-use the text returned from the first time the function was called.

```ts
// Defined in yavascript/src/api/help
declare function help.setHelpText.lazy(value: object, getText: () => string): void;
```

See also `help(help)` and `help(help.setHelpText)`.
