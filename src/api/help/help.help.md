# `help` - Print help text to stdout

Prints help and usage text about the provided value, if any is available.

When called without an argument, prints the help text for the `help` function itself.

```ts
// Defined in yavascript/src/api/help
declare function help(value?: any): void;
```

## Registering help text

To register help text for a provided value, use `help.setHelpText`:

```ts
// Defined in yavascript/src/api/help
declare function help.setHelpText(value: object, text: string): void;
```

See `help(help.setHelpText)` for more info.

## Accessing help text

To access the help text string associated with a value, use `help.getHelpText`:

```ts
// Defined in yavascript/src/api/help
declare function help.getHelpText(value: object): string | null;
```

See `help(help.getHelpText)` for more info.
