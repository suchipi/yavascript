`CSV` - Serializes or deserializes CSV data.

The `CSV` object contains a `parse` function and a `stringify` function which can be used to parse strings of CSV (comma-separated values) data into arrays-of-arrays-of-strings and serialize arrays-of-arrays-of-strings into strings of CSV data.

Its interface is similar to `JSON.parse` and `JSON.stringify`, but CSV does not support the spacing/replacer/reviver options that `JSON.parse` and `JSON.stringify` have.

```ts
// Defined in yavascript/src/api/csv
declare var CSV: {
  parse(input: string): Array<Array<string>>;
  stringify(input: Array<Array<string>>): string;
};
```

See `help(CSV.parse)` or `help(CSV.stringify)` for more info.
