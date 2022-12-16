declare const CSV: {
  /**
   * Parse a CSV string into an Array of Arrays of strings.
   *
   * The outer array holds the rows, and the inner arrays hold the items in
   * each row.
   */
  parse(input: string): Array<Array<string>>;

  /**
   * Convert an Array of Arrays of strings into a CSV string.
   *
   * The outer array holds the rows, and the inner arrays hold the items in
   * each row.
   */
  stringify(input: Array<Array<string>>): string;
};
