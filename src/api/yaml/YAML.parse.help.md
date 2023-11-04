# `YAML.parse` - deserialize a YAML document

The `YAML.parse` function converts a YAML document string into a JavaScript value. It works the same way that `JSON.parse` does, but for YAML.

```ts
// Defined in yavascript/src/api/yaml
declare function YAML.parse(
  input: string,
  reviver?: (this: any, key: string, value: any) => any
): any;
```

See also `help(YAML)` and `help(YAML.stringify)`.
