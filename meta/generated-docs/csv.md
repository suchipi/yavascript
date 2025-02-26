- [CSV (object)](#csv-object)
  - [CSV.parse (method)](#csvparse-method)
  - [CSV.stringify (method)](#csvstringify-method)

# CSV (object)

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
