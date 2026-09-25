import data from "./extensionless/special-values-yaml" with { type: "yaml" };

console.log(
  JSON.stringify({
    positive_infinity: data.positive_infinity === Infinity,
    negative_infinity: data.negative_infinity === -Infinity,
    not_a_number: Number.isNaN(data.not_a_number),
    big_integer: typeof data.big_integer + " " + String(data.big_integer),
    a_set: data.a_set instanceof Set && [...data.a_set].join(","),
    when: typeof data.when + " " + String(data.when),
  }),
);
