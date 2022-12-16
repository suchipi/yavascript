import { parse, stringify } from "yaml";

export const YAML = {
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any {
    return parse(input, reviver as any);
  },
  stringify(
    input: any,
    replacer?:
      | ((this: any, key: string, value: any) => any)
      | (number | string)[]
      | null,
    indent?: number
  ): string {
    return stringify(input, replacer, indent);
  },
};
