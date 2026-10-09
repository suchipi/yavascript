---
hide_title: true
---
## TOML (object)

An object with a `parse` function and a `stringify` function which can be
used to parse TOML document strings into objects and serialize objects into
TOML document strings.

Its interface is similar to `JSON.parse` and `JSON.stringify`, but
`TOML.parse` and `TOML.stringify` do not support the spacing/replacer/reviver
options that `JSON.parse` and `JSON.stringify` do.

**Example**

```ts
const config = TOML.parse(readFile("config.toml"));
config.version = "1.0.0";
writeFile("config.toml", TOML.stringify(config));
```

```ts
var TOML: {
  parse(data: string): {
    [key: string]: any;
  };
  stringify(data: { [key: string]: any }): string;
};
```

### TOML.parse (method)

Parse a TOML document string (`data`) into an object.

**Example**

```ts
const toml = 'name = "my-project"\n[build]\ntarget = "dist"\n';
const config = TOML.parse(toml);
console.log(config.name, config.build.target);
```

```ts
parse(data: string): {
  [key: string]: any;
};
```

### TOML.stringify (method)

Convert an object into a TOML document.

**Example**

```ts
const toml = TOML.stringify({
  name: "my-project",
  build: { target: "dist" },
});
console.log(toml);
// name = "my-project"
//
// [build]
// target = "dist"
//
```

```ts
stringify(data: {
  [key: string]: any;
}): string;
```
