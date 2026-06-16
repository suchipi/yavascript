/**
 * The `YAML` namespace contains functions which can serialize and deserialize
 * YAML documents, following the same pattern as JavaScript's `JSON` builtin.
 */
declare const YAML: {
  /**
   * Converts a YAML document string into a JavaScript value. It works the same
   * way that `JSON.parse` does, but for YAML.
   */
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any;

  /**
   * Converts a JavaScript value into a YAML document string. It works the same
   * way that `JSON.stringify` does, but for YAML.
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
