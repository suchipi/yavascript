declare const YAML: {
  /**
   * Parse a YAML document (`input`) into a JSON-compatible value.
   */
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any;

  /**
   * Convert a JSON-compatible value into a YAML document.
   */
  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number
  ): string;
};
