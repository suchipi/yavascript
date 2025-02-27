- [CSV (object)](#csv-object)
  - [CSV.parse (method)](#csvparse-method)
  - [CSV.stringify (method)](#csvstringify-method)

# CSV (object)

Serializes or deserializes CSV data.

The `CSV` object contains a `parse` function and a `stringify` function which
can be used to parse strings of CSV (comma-separated values) data into
arrays-of-arrays-of-strings and serialize arrays-of-arrays-of-strings into
strings of CSV data.

Its interface is similar to `JSON.parse` and `JSON.stringify`, but CSV does
not support the spacing/replacer/reviver options that `JSON.parse` and
`JSON.stringify` have.

```ts
const CSV: {
  parse(input: string): Array<Array<string>>;
  stringify(input: Array<Array<string>>): string;
};
```

## CSV.parse (method)

Parse a CSV string into an Array of Arrays of strings.

The outer array holds the rows, and the inner arrays hold the items in
each row.

```ts
parse(input: string): Array<Array<string>>;
```

## CSV.stringify (method)

Convert an Array of Arrays of strings into a CSV string.

The outer array holds the rows, and the inner arrays hold the items in
each row.

```ts
stringify(input: Array<Array<string>>): string;
```
