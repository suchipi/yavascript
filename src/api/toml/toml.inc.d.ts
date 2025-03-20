/**
 * An object with a `parse` function and a `stringify` function which can be
 * used to parse TOML document strings into objects and serialize objects into
 * TOML document strings.
 *
 * Its interface is similar to `JSON.parse` and `JSON.stringify`, but
 * `TOML.parse` and `TOML.stringify` do not support the spacing/replacer/reviver
 * options that `JSON.parse` and `JSON.stringify` do.
 */
declare var TOML: {
  /**
   * Parse a TOML document string (`data`) into an object.
   */
  parse(data: string): { [key: string]: any };
  /**
   * Convert an object into a TOML document.
   */
  stringify(data: { [key: string]: any }): string;
};
