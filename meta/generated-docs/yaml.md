# YAML (object)

```ts
const YAML: {
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any;
  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number,
  ): string;
};
```

## YAML.parse (method)

Parse a YAML document (`input`) into a JSON-compatible value.

```ts
parse(input: string, reviver?: (this: any, key: string, value: any) => any): any;
```

## YAML.stringify (method)

Convert a JSON-compatible value into a YAML document.

```ts
stringify(input: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, indent?: number): string;
```
