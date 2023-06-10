import { parse, stringify } from "yaml";
import { assert } from "../assert";
import { types } from "../types";

const reviverType = types.or(types.undefined, types.null, types.anyFunction);
const replacerType = types.or(
  types.undefined,
  types.null,
  types.anyFunction,
  types.arrayOf(types.or(types.number, types.string))
);
const indentType = types.or(types.undefined, types.number);

export const YAML = Object.assign(Object.create(null), {
  parse(
    input: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any {
    assert.type(input, types.string, "'input' argument must be a string");
    assert.type(
      reviver,
      reviverType,
      "when present, 'reviver' argument must be a function"
    );

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
    assert.type(
      replacer,
      replacerType,
      "when present, 'replacer' argument must be either a function or an Array of strings/numbers"
    );
    assert.type(
      indent,
      indentType,
      "when present, 'indent' argument must be a number"
    );

    return stringify(input, replacer, indent);
  },
});
