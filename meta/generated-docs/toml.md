- [TOML (object)](#toml-object)
  - [TOML.parse (method)](#tomlparse-method)
  - [TOML.stringify (method)](#tomlstringify-method)

# TOML (object)

```ts
var TOML: {
  parse(data: string): {
    [key: string]: any;
  };
  stringify(data: { [key: string]: any }): string;
};
```

## TOML.parse (method)

Parse a TOML document (`data`) into an object.

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
