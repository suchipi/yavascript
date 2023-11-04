# `YAML.stringify` - serialize to a YAML document

The `YAML.stringify` function converts a JavaScript value into a YAML document string. It works the same way that `JSON.stringify` does, but for YAML.

```ts
// Defined in yavascript/src/api/yaml
declare function YAML.stringify(
  input: any,
  replacer?:
    | ((this: any, key: string, value: any) => any)
    | (number | string)[]
    | null,
  indent?: number
): string;
```

See also `help(YAML)` and `help(YAML.parse)`.
