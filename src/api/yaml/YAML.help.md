# `YAML` - (de)serialize YAML documents

The `YAML` namespace contains functions which can serialize and deserialize YAML documents, following the same pattern as JavaScript's `JSON` builtin.

```ts
// Defined in yavascript/src/api/yaml
declare const YAML: {
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any;

  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number
  ): string;
};
```

See also `help(YAML.parse)` and `help(YAML.stringify)`.
