- [YAML (object)](#yaml-object)
  - [YAML.parse (method)](#yamlparse-method)
  - [YAML.stringify (method)](#yamlstringify-method)

# YAML (object)

The `YAML` namespace contains functions which can serialize and deserialize
YAML documents, following the same pattern as JavaScript's `JSON` builtin.

**Example**

```ts
const config = YAML.parse(readFile("config.yaml"));
config.replicas = 3;
writeFile("config.yaml", YAML.stringify(config));
```

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

Converts a YAML document string into a JavaScript value. It works the same
way that `JSON.parse` does, but for YAML.

**Example**

```ts
const data = YAML.parse("name: my-project\ntags:\n  - one\n  - two\n");
console.log(data.name, data.tags);
```

```ts
parse(input: string, reviver?: (this: any, key: string, value: any) => any): any;
```

## YAML.stringify (method)

Converts a JavaScript value into a YAML document string. It works the same
way that `JSON.stringify` does, but for YAML.

**Example**

```ts
const data = { name: "my-project", tags: ["one", "two"] };
const yaml = YAML.stringify(data, null, 2);
console.log(yaml);
```

```ts
stringify(input: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, indent?: number): string;
```
