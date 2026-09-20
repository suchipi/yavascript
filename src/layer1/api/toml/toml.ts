import iarnaTOML from "@iarna/toml";
import TOMLParser from "@iarna/toml/lib/toml-parser.js";

// parseOnlyTimeFractionMaybe finishes with `return`, which steps past the
// current character. By then the current character is already the delimiter,
// so a local time with no fractional part swallowed the newline after it and
// the following line failed to parse. The fraction branch beside it uses
// returnNow, which re-runs the state machine on that character instead.
const parseOnlyTimeFractionMaybe =
  TOMLParser.prototype.parseOnlyTimeFractionMaybe;
TOMLParser.prototype.parseOnlyTimeFractionMaybe = function (this: any) {
  // returnNow delegates to return, so the override has to take itself back
  // off before handing over, or it would call itself.
  this.return = function (this: any, value: unknown) {
    delete this.return;
    return this.returnNow(value);
  };

  try {
    return parseOnlyTimeFractionMaybe.call(this);
  } finally {
    delete this.return;
  }
};

export const TOML = {
  parse(data: string): { [key: string]: any } {
    return iarnaTOML.parse(data);
  },
  stringify(data: { [key: string]: any }): string {
    return iarnaTOML.stringify(data);
  },
};
