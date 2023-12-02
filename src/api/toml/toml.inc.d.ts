declare var TOML: {
  /**
   * Parse a TOML document (`data`) into an object.
   */
  parse(data: string): { [key: string]: any };
  /**
   * Convert an object into a TOML document.
   */
  stringify(data: { [key: string]: any }): string;
};
