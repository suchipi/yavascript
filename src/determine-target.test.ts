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

  ["-r"], // invalid
  ["--require"], // invalid

  ["--", "-r"], // '-r' not interpreted as one of our flags
  ["--", "--require"], // '--require' not interpreted as one of our flags

  // load file then go to repl
  ["-r", "some-file"],
  ["--require", "some-file"],

  // load two files then go to repl
  ["-r", "some-file", "-r", "another-file"],
  ["--require", "some-file", "--require", "another-file"],

  // load file then load other file
  ["-r", "some-file", "main-file"],
  ["--require", "some-file", "main-file"],

  // load two files then load other file
  ["-r", "some-file", "-r", "another-file", "main-file"],
  ["--require", "some-file", "--require", "another-file", "main-file"],

  // load file then eval code
  ["-r", "some-file", "-e", "2 + 2"],
  ["-r", "some-file", "--eval", "2 + 2"],
  ["--require", "some-file", "--eval", "2 + 2"],
  ["--require", "some-file", "-e", "2 + 2"],

  // pass '-r' or '--require' to user's script when it appears after file to load
  ["my-file", "-r", "some-file"],
  ["my-file", "-r"], // not invalid because -r is not interpreted as one of our flags
  ["my-file", "--require", "some-file"],
  ["my-file", "--require"], // not invalid because -r is not interpreted as one of our flags

  // eval and ignore flag because it's after --
  ["--eval", "2 + 2", "--", "-r"],
  ["--eval", "2 + 2", "--", "--require"],
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
