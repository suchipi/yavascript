# `inspect` - pretty-print any value to string

`inspect` is a builtin global provided by QuickJS. It can be used to create a human-readable string representation of any value. `console.log`, `print`, `echo`, and other similar value-printing functions all use `inspect` internally.

## API

```ts
// Defined in quickjs
declare function inspect(value: any, options?: InspectOptions): string;
```

Where `InspectOptions` is an object with any of these properties (all are optional):

- `all` (boolean)
  - Whether to display non-enumerable properties. Defaults to false.
- `followGetters` (boolean)
  - Whether to invoke getter functions. Defaults to false.
- `indexes` (boolean)
  - Whether to display the indexes of iterable entries. Defaults to false.
- `maxDepth` (number)
  - Hide object details after 𝑁 recursions. Defaults to Infinity.
- `noAmp` (boolean)
  - If true, don't identify well-known symbols as `@@…`. Defaults to false.
- `noHex` (boolean)
  - If true, don't format byte-arrays as hexadecimal. Defaults to false.
- `noSource` (boolean)
  - If true, don't display function source code. Defaults to false.
- `proto` (boolean)
  - Whether to show `__proto__` properties if possible. Defaults to false.
- `sort` (boolean)
  - Whether to sort properties alphabetically. When false, properties are sorted by creation order. Defaults to false.
- `colours` (boolean | 256 | 8 | `InspectColours`)
  - Options that control whether and how ANSI terminal escape sequences for colours should be added to the output. Defaults to false, meaning no colours.
- `indent` (string)
  - Prefix string to use for indentation. Defaults to '\t'.

And `InspectColours` is an object with any of _these_ properties (all are optional), whose values are a string or number:

- off
- red
- grey
- green
- darkGreen
- punct
- keys
- keyEscape
- typeColour
- primitive
- escape
- date
- hexBorder
- hexValue
- hexOffset
- reference
- srcBorder
- srcRowNum
- srcRowText
- nul
- nulProt
- undef
- noExts
- frozen
- sealed
- regex
- string
- symbol
- symbolFade
- braces
- quotes
- empty
- dot

## Options when called by builtins

### Logging functions

When `inspect` is called by `console.log`, `print`, `echo`, or other similar functions, it receives these options:

```ts
{
  maxDepth: 8,
  noAmp: true,
  colours: /* boolean indicating whether your terminal supports color */,
  indent: "  ",
  noSource: true,
}
```

The value of `colours` can be overridden by using the environment variables `CLICOLOR` or `CLICOLOR_FORCE`, according to the standard documented at https://bixense.com/clicolors/.

### Error messages

When `inspect` is called by various builtins for the purpose of embedding a value within an Error message, it receives these options:

```ts
{
  maxDepth: 1,
  noAmp: true,
  colours: false,
  indent: "",
  noSource: true,
}
```

The resulting string gets all whitespace replaced with `" "` before being embedded in the error message.

## `inspect.custom`

Objects can define custom handling for the `inspect` function by defining a method with the key `inspect.custom` (a Symbol). Whenever `inspect` encounters an object that contains an `inspect.custom` method on it, it will call the method right before printing the object normally, to allow it to make changes to what's about to be printed. `inspect.custom` gets called with a single argument, `inputs`, which is an object containing all of the variables `inspect` uses internally to represent printable values. The method may change any of these values as desired by mutating the properties on `inputs`.

The `inspect` function comes from https://github.com/suchipi/print.
