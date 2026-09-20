import Papa from "papaparse";
import { assert } from "../assert";
import { types } from "../types";

export const CSV = {
  parse(input: string): Array<Array<string>> {
    assert.type(input, types.string, "'input' argument must be a string");

    // Without a fixed delimiter Papa guesses one, which splits on ";" or tab
    // and reports UndetectableDelimiter as an error on ordinary 2-column data.
    const { data, errors } = Papa.parse(input, {
      header: false,
      delimiter: ",",
    });
    if (errors.length > 0) {
      const messageParts = [
        "CSV parse failed:",
        ...errors.map((error) => {
          return `Row ${(error.row ?? 0) + 1}: ${error.code}: ${error.message}`;
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

    const rows = data as Array<Array<string>>;

    if (input === "") {
      return [];
    }

    // The text after the final line terminator is reported as a row, which for
    // a file ending in one is not a record.
    const lastRow = rows[rows.length - 1];
    if (
      /(\r\n|\n|\r)$/.test(input) &&
      lastRow != null &&
      lastRow.length === 1 &&
      lastRow[0] === ""
    ) {
      return rows.slice(0, -1);
    }

    return rows;
  },
  stringify(input: Array<Array<string>>): string {
    assert.type(
      input,
      types.arrayOf(types.arrayOf(types.string)),
      "'input' argument must be an array of arrays of strings",
    );

    return Papa.unparse(input);
  },
};
