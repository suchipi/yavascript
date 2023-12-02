# `TOML` - Serializes or deserializes TOML documents.

The `TOML` object contains a `parse` function and a `stringify` function which can be used to parse TOML document strings into objects and serialize objects into TOML document strings.

Its interface is similar to `JSON.parse` and `JSON.stringify`, but TOML does not support the spacing/replacer/reviver options that `JSON.parse` and `JSON.stringify` have.

```ts
// Defined in yavascript/src/api/toml
declare var TOML: {
  parse(input: string): { [key: string]: any };
  stringify(input: { [key: string]: any }): string;
};
```

See `help(TOML.parse)` or `help(TOML.stringify)` for more info.
