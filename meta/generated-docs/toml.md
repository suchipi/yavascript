- [TOML (object)](#toml-object)
  - [TOML.parse (method)](#tomlparse-method)
  - [TOML.stringify (method)](#tomlstringify-method)

# TOML (object)

An object with a `parse` function and a `stringify` function which can be
used to parse TOML document strings into objects and serialize objects into
TOML document strings.

Its interface is similar to `JSON.parse` and `JSON.stringify`, but
`TOML.parse` and `TOML.stringify` do not support the spacing/replacer/reviver
options that `JSON.parse` and `JSON.stringify` do.

```ts
var TOML: {
  parse(data: string): {
    [key: string]: any;
  };
  stringify(data: { [key: string]: any }): string;
};
```

## TOML.parse (method)

Parse a TOML document string (`data`) into an object.

```ts
parse(data: string): {
  [key: string]: any;
};
```

## TOML.stringify (method)

Convert an object into a TOML document.

```ts
stringify(data: {
  [key: string]: any;
}): string;
```
