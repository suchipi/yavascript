- [YAML (object)](#yaml-object)
  - [YAML.parse (method)](#yamlparse-method)
  - [YAML.stringify (method)](#yamlstringify-method)

# YAML (object)

The `YAML` namespace contains functions which can serialize and deserialize
YAML documents, following the same pattern as JavaScript's `JSON` builtin.

```ts
const YAML: {
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

## YAML.parse (method)

Converts a YAML document string into a JavaScript value. It works the same
way that `JSON.parse` does, but for YAML.

```ts
parse(input: string, reviver?: (this: any, key: string, value: any) => any): any;
```

## YAML.stringify (method)

Converts a JavaScript value into a YAML document string. It works the same
way that `JSON.stringify` does, but for YAML.

```ts
stringify(input: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, indent?: number): string;
```
