/**
 * The `YAML` namespace contains functions which can serialize and deserialize
 * YAML documents, following the same pattern as JavaScript's `JSON` builtin.
 *
 * **Example**
 * ```ts
 * const config = YAML.parse(readFile("config.yaml"));
 * config.replicas = 3;
 * writeFile("config.yaml", YAML.stringify(config));
 * ```
 */
declare const YAML: {
  /**
   * Converts a YAML document string into a JavaScript value. It works the same
   * way that `JSON.parse` does, but for YAML.
   *
   * **Example**
   * ```ts
   * const data = YAML.parse("name: my-project\ntags:\n  - one\n  - two\n");
   * console.log(data.name, data.tags);
   * ```
   */
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any;

  /**
   * Converts a JavaScript value into a YAML document string. It works the same
   * way that `JSON.stringify` does, but for YAML.
   *
   * **Example**
   * ```ts
   * const data = { name: "my-project", tags: ["one", "two"] };
   * const yaml = YAML.stringify(data, null, 2);
   * console.log(yaml);
   * ```
   */
  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number,
  ): string;
};
