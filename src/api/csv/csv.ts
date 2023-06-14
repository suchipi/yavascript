import Papa from "papaparse";
import { assert } from "../assert";
import { types } from "../types";
import { setHelpText } from "../help";
import csvHelpText from "./csv.help.md";
import csvParseHelpText from "./csv.parse.help.md";
import csvStringifyHelpText from "./csv.stringify.help.md";

export const CSV = {
  parse(input: string): Array<Array<string>> {
    assert.type(input, types.string, "'input' argument must be a string");

    const { data, errors } = Papa.parse(input, { header: false });
    if (errors.length > 0) {
      const messageParts = [
        "CSV parse failed:",
        ...errors.map((error) => {
          return `Row ${error.row + 1}: ${error.code}: ${error.message}`;
        }),
      ];

      let message: string;
      if (messageParts.length <= 2) {
        message = messageParts.join(" ");
      } else {
        message = [
          messageParts[0],
          ...messageParts.slice(1).map((part) => "- " + part),
        ].join("\n");
      }

      throw new Error(message);
    }

    return data as any;
  },
  stringify(input: Array<Array<string>>): string {
    assert.type(
      input,
      types.arrayOf(types.arrayOf(types.string)),
      "'input' argument must be an array of arrays of strings"
    );

    return Papa.unparse(input);
  },
};

setHelpText(CSV, csvHelpText);
setHelpText(CSV.parse, csvParseHelpText);
setHelpText(CSV.stringify, csvStringifyHelpText);
