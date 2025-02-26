- [help (function)](#help-function)
  - [help(...) (call signature)](#help-call-signature)
  - [help.setHelpText (function property)](#helpsethelptext-function-property)
    - [help.setHelpText(...) (call signature)](#helpsethelptext-call-signature)
    - [help.setHelpText.lazy (method)](#helpsethelptextlazy-method)

# help (function)

Prints help and usage text about the provided value, if any is available.

```ts
var help: {
  (value?: any): void;
  setHelpText: {
    (value: object, text: string, allowNullish?: boolean): void;
    lazy(value: object, getText: () => string): void;
  };
};
```

## help(...) (call signature)

Prints help and usage text about the provided value, if any is available.

```ts
(value?: any): void;
```

## help.setHelpText (function property)

Set the help text for the provided value to the provided string.

If the value is later passed into the `help` function, the provided text
will be printed.

```ts
setHelpText: {
  (value: object, text: string, allowNullish?: boolean): void;
  lazy(value: object, getText: () => string): void;
};
```

### help.setHelpText(...) (call signature)

Set the help text for the provided value to the provided string.

If the value is later passed into the `help` function, the provided text
will be printed.

To set help text for the values `null` or `undefined`, `allowNullish`
must be `true`.

```ts
(value: object, text: string, allowNullish?: boolean): void;
```

### help.setHelpText.lazy (method)

Lazily sets the help text for the provided value using the provided
string-returning function.

The first time help text is requested for the value, the string-returning
function will be called, and its result will be registered as the help
text for the value. Afterwards, the function will not be called again;
instead, it will re-use the text returned from the first time the
function was called.

```ts
lazy(value: object, getText: () => string): void;
```
