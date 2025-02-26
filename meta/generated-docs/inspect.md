- [InspectOptions (interface)](#inspectoptions-interface)
  - [InspectOptions.all (boolean property)](#inspectoptionsall-boolean-property)
  - [InspectOptions.followGetters (boolean property)](#inspectoptionsfollowgetters-boolean-property)
  - [InspectOptions.indexes (boolean property)](#inspectoptionsindexes-boolean-property)
  - [InspectOptions.maxDepth (number property)](#inspectoptionsmaxdepth-number-property)
  - [InspectOptions.noAmp (boolean property)](#inspectoptionsnoamp-boolean-property)
  - [InspectOptions.noHex (boolean property)](#inspectoptionsnohex-boolean-property)
  - [InspectOptions.noSource (boolean property)](#inspectoptionsnosource-boolean-property)
  - [InspectOptions.proto (boolean property)](#inspectoptionsproto-boolean-property)
  - [InspectOptions.sort (boolean property)](#inspectoptionssort-boolean-property)
  - [InspectOptions.colours (property)](#inspectoptionscolours-property)
  - [InspectOptions.indent (string property)](#inspectoptionsindent-string-property)
- [InspectColours (interface)](#inspectcolours-interface)
  - [InspectColours.off (property)](#inspectcoloursoff-property)
  - [InspectColours.red (property)](#inspectcoloursred-property)
  - [InspectColours.grey (property)](#inspectcoloursgrey-property)
  - [InspectColours.green (property)](#inspectcoloursgreen-property)
  - [InspectColours.darkGreen (property)](#inspectcoloursdarkgreen-property)
  - [InspectColours.punct (property)](#inspectcolourspunct-property)
  - [InspectColours.keys (property)](#inspectcolourskeys-property)
  - [InspectColours.keyEscape (property)](#inspectcolourskeyescape-property)
  - [InspectColours.typeColour (property)](#inspectcolourstypecolour-property)
  - [InspectColours.primitive (property)](#inspectcoloursprimitive-property)
  - [InspectColours.escape (property)](#inspectcoloursescape-property)
  - [InspectColours.date (property)](#inspectcoloursdate-property)
  - [InspectColours.hexBorder (property)](#inspectcolourshexborder-property)
  - [InspectColours.hexValue (property)](#inspectcolourshexvalue-property)
  - [InspectColours.hexOffset (property)](#inspectcolourshexoffset-property)
  - [InspectColours.reference (property)](#inspectcoloursreference-property)
  - [InspectColours.srcBorder (property)](#inspectcolourssrcborder-property)
  - [InspectColours.srcRowNum (property)](#inspectcolourssrcrownum-property)
  - [InspectColours.srcRowText (property)](#inspectcolourssrcrowtext-property)
  - [InspectColours.nul (property)](#inspectcoloursnul-property)
  - [InspectColours.nulProt (property)](#inspectcoloursnulprot-property)
  - [InspectColours.undef (property)](#inspectcoloursundef-property)
  - [InspectColours.noExts (property)](#inspectcoloursnoexts-property)
  - [InspectColours.frozen (property)](#inspectcoloursfrozen-property)
  - [InspectColours.sealed (property)](#inspectcolourssealed-property)
  - [InspectColours.regex (property)](#inspectcoloursregex-property)
  - [InspectColours.string (property)](#inspectcoloursstring-property)
  - [InspectColours.symbol (property)](#inspectcolourssymbol-property)
  - [InspectColours.symbolFade (property)](#inspectcolourssymbolfade-property)
  - [InspectColours.braces (property)](#inspectcoloursbraces-property)
  - [InspectColours.quotes (property)](#inspectcoloursquotes-property)
  - [InspectColours.empty (property)](#inspectcoloursempty-property)
  - [InspectColours.dot (property)](#inspectcoloursdot-property)
- [InspectFunction (interface)](#inspectfunction-interface)
  - [InspectFunction(...) (call signature)](#inspectfunction-call-signature)
  - [InspectFunction(...) (call signature)](#inspectfunction-call-signature-1)
  - [InspectFunction.custom (symbol property)](#inspectfunctioncustom-symbol-property)
- [inspect (InspectFunction)](#inspect-inspectfunction)
- [InspectCustomInputs (interface)](#inspectcustominputs-interface)
  - [InspectCustomInputs.key (property)](#inspectcustominputskey-property)
  - [InspectCustomInputs.type (string property)](#inspectcustominputstype-string-property)
  - [InspectCustomInputs.brackets (property)](#inspectcustominputsbrackets-property)
  - [InspectCustomInputs.oneLine (boolean property)](#inspectcustominputsoneline-boolean-property)
  - [InspectCustomInputs.linesBefore (property)](#inspectcustominputslinesbefore-property)
  - [InspectCustomInputs.linesAfter (property)](#inspectcustominputslinesafter-property)
  - [InspectCustomInputs.propLines (property)](#inspectcustominputsproplines-property)
  - [InspectCustomInputs.tooDeep (boolean property)](#inspectcustominputstoodeep-boolean-property)
  - [InspectCustomInputs.indent (string property)](#inspectcustominputsindent-string-property)
  - [InspectCustomInputs.typeSuffix (string property)](#inspectcustominputstypesuffix-string-property)
  - [InspectCustomInputs.opts (InspectOptions property)](#inspectcustominputsopts-inspectoptions-property)
  - [InspectCustomInputs.colours (property)](#inspectcustominputscolours-property)

# InspectOptions (interface)

npm: @suchipi/print@2.5.0. License: ISC

Options for [inspect](/meta/generated-docs/inspect.md#inspect-inspectfunction).

```ts
declare interface InspectOptions {
  all?: boolean;
  followGetters?: boolean;
  indexes?: boolean;
  maxDepth?: number;
  noAmp?: boolean;
  noHex?: boolean;
  noSource?: boolean;
  proto?: boolean;
  sort?: boolean;
  colours?: boolean | 256 | 8 | InspectColours;
  indent?: string;
}
```

## InspectOptions.all (boolean property)

Whether to display non-enumerable properties. Defaults to false.

```ts
all?: boolean;
```

## InspectOptions.followGetters (boolean property)

Whether to invoke getter functions. Defaults to false.

```ts
followGetters?: boolean;
```

## InspectOptions.indexes (boolean property)

Whether to display the indexes of iterable entries. Defaults to false.

```ts
indexes?: boolean;
```

## InspectOptions.maxDepth (number property)

Hide object details after 𝑁 recursions. Defaults to Infinity.

```ts
maxDepth?: number;
```

## InspectOptions.noAmp (boolean property)

If true, don't identify well-known symbols as `@@…`. Defaults to false.

```ts
noAmp?: boolean;
```

## InspectOptions.noHex (boolean property)

If true, don't format byte-arrays as hexadecimal. Defaults to false.

```ts
noHex?: boolean;
```

## InspectOptions.noSource (boolean property)

If true, don't display function source code. Defaults to false.

```ts
noSource?: boolean;
```

## InspectOptions.proto (boolean property)

Whether to show `__proto__` properties if possible. Defaults to false.

```ts
proto?: boolean;
```

## InspectOptions.sort (boolean property)

Whether to sort properties alphabetically. When false, properties are sorted by creation order. Defaults to false.

```ts
sort?: boolean;
```

## InspectOptions.colours (property)

Options that control whether and how ANSI terminal escape sequences for colours should be added to the output. Defaults to false, meaning no colours.

```ts
colours?: boolean | 256 | 8 | InspectColours;
```

## InspectOptions.indent (string property)

Prefix string to use for indentation. Defaults to '\t'.

```ts
indent?: string;
```

# InspectColours (interface)

```ts
declare interface InspectColours {
  off?: string | number;
  red?: string | number;
  grey?: string | number;
  green?: string | number;
  darkGreen?: string | number;
  punct?: string | number;
  keys?: string | number;
  keyEscape?: string | number;
  typeColour?: string | number;
  primitive?: string | number;
  escape?: string | number;
  date?: string | number;
  hexBorder?: string | number;
  hexValue?: string | number;
  hexOffset?: string | number;
  reference?: string | number;
  srcBorder?: string | number;
  srcRowNum?: string | number;
  srcRowText?: string | number;
  nul?: string | number;
  nulProt?: string | number;
  undef?: string | number;
  noExts?: string | number;
  frozen?: string | number;
  sealed?: string | number;
  regex?: string | number;
  string?: string | number;
  symbol?: string | number;
  symbolFade?: string | number;
  braces?: string | number;
  quotes?: string | number;
  empty?: string | number;
  dot?: string | number;
}
```

## InspectColours.off (property)

```ts
off?: string | number;
```

## InspectColours.red (property)

```ts
red?: string | number;
```

## InspectColours.grey (property)

```ts
grey?: string | number;
```

## InspectColours.green (property)

```ts
green?: string | number;
```

## InspectColours.darkGreen (property)

```ts
darkGreen?: string | number;
```

## InspectColours.punct (property)

```ts
punct?: string | number;
```

## InspectColours.keys (property)

```ts
keys?: string | number;
```

## InspectColours.keyEscape (property)

```ts
keyEscape?: string | number;
```

## InspectColours.typeColour (property)

```ts
typeColour?: string | number;
```

## InspectColours.primitive (property)

```ts
primitive?: string | number;
```

## InspectColours.escape (property)

```ts
escape?: string | number;
```

## InspectColours.date (property)

```ts
date?: string | number;
```

## InspectColours.hexBorder (property)

```ts
hexBorder?: string | number;
```

## InspectColours.hexValue (property)

```ts
hexValue?: string | number;
```

## InspectColours.hexOffset (property)

```ts
hexOffset?: string | number;
```

## InspectColours.reference (property)

```ts
reference?: string | number;
```

## InspectColours.srcBorder (property)

```ts
srcBorder?: string | number;
```

## InspectColours.srcRowNum (property)

```ts
srcRowNum?: string | number;
```

## InspectColours.srcRowText (property)

```ts
srcRowText?: string | number;
```

## InspectColours.nul (property)

```ts
nul?: string | number;
```

## InspectColours.nulProt (property)

```ts
nulProt?: string | number;
```

## InspectColours.undef (property)

```ts
undef?: string | number;
```

## InspectColours.noExts (property)

```ts
noExts?: string | number;
```

## InspectColours.frozen (property)

```ts
frozen?: string | number;
```

## InspectColours.sealed (property)

```ts
sealed?: string | number;
```

## InspectColours.regex (property)

```ts
regex?: string | number;
```

## InspectColours.string (property)

```ts
string?: string | number;
```

## InspectColours.symbol (property)

```ts
symbol?: string | number;
```

## InspectColours.symbolFade (property)

```ts
symbolFade?: string | number;
```

## InspectColours.braces (property)

```ts
braces?: string | number;
```

## InspectColours.quotes (property)

```ts
quotes?: string | number;
```

## InspectColours.empty (property)

```ts
empty?: string | number;
```

## InspectColours.dot (property)

```ts
dot?: string | number;
```

# InspectFunction (interface)

```ts
declare interface InspectFunction {
  (value: any, options?: InspectOptions): string;
  (value: any, key?: string | symbol, options?: InspectOptions): string;
  custom: symbol;
}
```

## InspectFunction(...) (call signature)

Generate a human-readable representation of a value.

- `@param` _value_ — Value to inspect
- `@param` _options_ — Additional settings for refining output
- `@returns` A string representation of `value`.

```ts
(value: any, options?: InspectOptions): string;
```

## InspectFunction(...) (call signature)

Generate a human-readable representation of a value.

- `@param` _value_ — Value to inspect
- `@param` _key_ — The value's corresponding member name
- `@param` _options_ — Additional settings for refining output
- `@returns` A string representation of `value`.

```ts
(value: any, key?: string | symbol, options?: InspectOptions): string;
```

## InspectFunction.custom (symbol property)

A symbol which can be used to customize how an object gets printed.

```ts
custom: symbol;
```

# inspect (InspectFunction)

Generate a human-readable representation of a value.

- `@param` _value_ — Value to inspect
- `@param` _key_ — The value's corresponding member name
- `@param` _options_ — Additional settings for refining output
- `@returns` A string representation of `value`.

```ts
var inspect: InspectFunction;
```

# InspectCustomInputs (interface)

```ts
declare interface InspectCustomInputs {
  key: string | symbol;
  type: string;
  brackets: [string, string];
  oneLine: boolean;
  linesBefore: Array<string>;
  linesAfter: Array<string>;
  propLines: Array<string>;
  readonly tooDeep: boolean;
  indent: string;
  typeSuffix: string;
  opts: InspectOptions;
  colours: { [Key in keyof Required<InspectColours>]: string };
}
```

## InspectCustomInputs.key (property)

```ts
key: string | symbol;
```

## InspectCustomInputs.type (string property)

```ts
type: string;
```

## InspectCustomInputs.brackets (property)

```ts
brackets: [string, string];
```

## InspectCustomInputs.oneLine (boolean property)

```ts
oneLine: boolean;
```

## InspectCustomInputs.linesBefore (property)

```ts
linesBefore: Array<string>;
```

## InspectCustomInputs.linesAfter (property)

```ts
linesAfter: Array<string>;
```

## InspectCustomInputs.propLines (property)

```ts
propLines: Array<string>;
```

## InspectCustomInputs.tooDeep (boolean property)

```ts
readonly tooDeep: boolean;
```

## InspectCustomInputs.indent (string property)

```ts
indent: string;
```

## InspectCustomInputs.typeSuffix (string property)

```ts
typeSuffix: string;
```

## InspectCustomInputs.opts (InspectOptions property)

```ts
opts: InspectOptions;
```

## InspectCustomInputs.colours (property)

```ts
colours: { [Key in keyof Required<InspectColours>]: string };
```
