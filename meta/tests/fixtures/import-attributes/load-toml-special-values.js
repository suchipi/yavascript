import data from "./extensionless/special-values-toml" with { type: "toml" };

console.log(
  JSON.stringify({
    positive_infinity: data.positive_infinity === Infinity,
    negative_infinity: data.negative_infinity === -Infinity,
    not_a_number: Number.isNaN(data.not_a_number),
    big_integer: typeof data.big_integer + " " + String(data.big_integer),
    when: data.when instanceof Date && data.when.toISOString(),
  }),
);
