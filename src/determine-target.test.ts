import determineTarget from "./determine-target";

const inputs: Array<Array<string>> = [
  [], // repl

  ["-h"],
  ["--help"],
  ["-v"],
  ["--version"],
  ["-version"],
  ["--license"],
  ["--print-types"],
  ["-e"], // invalid
  ["--eval"], // invalid
  ["--lang"], // invalid

  ["-e", "2 + 2"],
  ["--eval", "2 + 2"],
  ["--eval", "2 + 2", "--lang", "coffee"],
  ["-e", "2 + 2", "--lang", "coffee"],
  ["--lang", "tsx", "--eval", "2 + 2"],
  ["--lang", "tsx", "-e", "2 + 2"],

  ["--eval", "2 + 2", "--lang"], // invalid
  ["--eval", "--lang", "js"], // weird but not invalid

  ["something.js"],
  ["something.js", "--lang", "coffee"],
  ["--lang", "jsx", "../something.js"],

  ["--lang", "../something.js"], // invalid lang
  ["../something.js", "--lang"], // invalid lang
  ["../something.js", "--lang", "potato"], // invalid lang

  ["/tmp/something", "-v", "--help"], // should forward scriptArgs to program

  ["--"], // repl
  ["--", "-v"], // repl with flag
  ["some-file", "--", "--hi"],
];

for (const input of inputs) {
  let testName = input
    .map((part) => (/\s/.test(part) ? JSON.stringify(part) : part))
    .join(" ");

  if (testName == "") testName = "(empty)";

  test(testName, () => {
    const argv = ["/usr/local/bin/yavascript", ...input];
    const result = determineTarget(argv);
    expect({ argv, result }).toMatchSnapshot();
  });
}
