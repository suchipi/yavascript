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
    // The parser boxes an out-of-range integer with BigInt.asIntN(64, value),
    // which silently wraps it: 9223372036854775808 comes back negative. There
    // is no way to tell from the result afterwards, so the wrap is watched for
    // while it happens. Parsing is synchronous, so the global is only replaced
    // for the duration of this call.
    let overflowed = false;
    const asIntN = BigInt.asIntN;
    (BigInt as any).asIntN = (bits: number, value: any) => {
      const wrapped = asIntN(bits, value);
      try {
        // The parser passes the digits as a string, which asIntN coerces.
        if (wrapped !== BigInt(value)) overflowed = true;
      } catch {
        // not a number at all; leave it to the parser to complain
      }
      return wrapped;
    };

    let result: { [key: string]: any };
    try {
      result = iarnaTOML.parse(data);
    } finally {
      (BigInt as any).asIntN = asIntN;
    }

    if (overflowed) {
      throw new Error(
        "TOML parse failed: an integer in this document is outside the range TOML allows (signed 64-bit).",
      );
    }

    return result;
  },
  stringify(data: { [key: string]: any }): string {
    return iarnaTOML.stringify(data);
  },
};
