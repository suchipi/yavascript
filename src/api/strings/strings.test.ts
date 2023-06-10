import { evaluate } from "../../test-helpers";

const names = {};

function testFn(name: string, input: string, expected: string) {
  let testName = name;

  if (names[name] != null) {
    testName = `${name} ${names[name] + 1}`;
    names[name]++;
  } else {
    names[name] = 1;
  }

  test(testName, async () => {
    const result = await evaluate(`${name}(${JSON.stringify(input)})`);
    expect(result).toEqual({
      code: 0,
      error: false,
      stderr: "",
      stdout: expected + "\n",
    });
  });
}

describe("stuff from kleur", () => {
  testFn("bgBlack", "_IN_", "\x1B[40m_IN_\x1B[49m");
  testFn("bgBlue", "_IN_", "\x1B[44m_IN_\x1B[49m");
  testFn("bgCyan", "_IN_", "\x1B[46m_IN_\x1B[49m");
  testFn("bgGreen", "_IN_", "\x1B[42m_IN_\x1B[49m");
  testFn("bgMagenta", "_IN_", "\x1B[45m_IN_\x1B[49m");
  testFn("bgRed", "_IN_", "\x1B[41m_IN_\x1B[49m");
  testFn("bgWhite", "_IN_", "\x1B[47m_IN_\x1B[49m");
  testFn("bgYellow", "_IN_", "\x1B[43m_IN_\x1B[49m");

  testFn("black", "_IN_", "\x1B[30m_IN_\x1B[39m");
  testFn("blue", "_IN_", "\x1B[34m_IN_\x1B[39m");
  testFn("cyan", "_IN_", "\x1B[36m_IN_\x1B[39m");
  testFn("green", "_IN_", "\x1B[32m_IN_\x1B[39m");
  testFn("magenta", "_IN_", "\x1B[35m_IN_\x1B[39m");
  testFn("red", "_IN_", "\x1B[31m_IN_\x1B[39m");
  testFn("white", "_IN_", "\x1B[37m_IN_\x1B[39m");
  testFn("yellow", "_IN_", "\x1B[33m_IN_\x1B[39m");

  // gray uses "bright black"
  testFn("gray", "_IN_", "\x1B[90m_IN_\x1B[39m");
  testFn("grey", "_IN_", "\x1B[90m_IN_\x1B[39m");

  testFn("bold", "_IN_", "\x1B[1m_IN_\x1B[22m");
  testFn("dim", "_IN_", "\x1B[2m_IN_\x1B[22m");
  testFn("hidden", "_IN_", "\x1B[8m_IN_\x1B[28m");
  testFn("inverse", "_IN_", "\x1B[7m_IN_\x1B[27m");
  testFn("italic", "_IN_", "\x1B[3m_IN_\x1B[23m");
  testFn("strikethrough", "_IN_", "\x1B[9m_IN_\x1B[29m");
  testFn("underline", "_IN_", "\x1B[4m_IN_\x1B[24m");

  testFn("reset", "_IN_", "\x1B[0m_IN_\x1B[0m");
});

testFn("stripAnsi", "\x1B[90m_IN_\x1B[39m", "_IN_");
testFn("stripAnsi", "\x1B[30m_IN_\x1B[39m", "_IN_");
testFn("stripAnsi", "_IN_", "_IN_");

testFn("quote", "hi", '"hi"');
testFn("quote", 'bla " bla', '"bla \\" bla"');
testFn("quote", "bla ' bla", '"bla \' bla"');
