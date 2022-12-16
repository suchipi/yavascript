import Papa from "papaparse";

export const CSV = {
  parse(input: string): Array<Array<string>> {
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
    return Papa.unparse(input);
  },
};
