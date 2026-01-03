import { evaluate } from "./test-helpers";

const names = {};

function testFn(
  name: string,
  input: string | number | { raw: string },
  expected: string,
) {
  let testName = name;

  if (names[name] != null) {
    testName = `${name} ${names[name] + 1}`;
    names[name]++;
  } else {
    names[name] = 1;
  }

  test(testName, async () => {
    const code = `${name}(${
      typeof input === "object" && typeof input.raw === "string"
        ? input.raw
        : JSON.stringify(input)
    })`;

    const result = await evaluate(code);
    expect(result).toEqual({
      code: 0,
      error: false,
      stderr: "",
      stdout: expected + "\n",
    });
  });
}

describe("string inputs", () => {
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
});

describe("number inputs", () => {
  describe("stuff from kleur", () => {
    testFn("bgBlack", 87, "\x1B[40m87\x1B[49m");
    testFn("bgBlue", 87, "\x1B[44m87\x1B[49m");
    testFn("bgCyan", 87, "\x1B[46m87\x1B[49m");
    testFn("bgGreen", 87, "\x1B[42m87\x1B[49m");
    testFn("bgMagenta", 87, "\x1B[45m87\x1B[49m");
    testFn("bgRed", 87, "\x1B[41m87\x1B[49m");
    testFn("bgWhite", 87, "\x1B[47m87\x1B[49m");
    testFn("bgYellow", 87, "\x1B[43m87\x1B[49m");

    testFn("black", 87, "\x1B[30m87\x1B[39m");
    testFn("blue", 87, "\x1B[34m87\x1B[39m");
    testFn("cyan", 87, "\x1B[36m87\x1B[39m");
    testFn("green", 87, "\x1B[32m87\x1B[39m");
    testFn("magenta", 87, "\x1B[35m87\x1B[39m");
    testFn("red", 87, "\x1B[31m87\x1B[39m");
    testFn("white", 87, "\x1B[37m87\x1B[39m");
    testFn("yellow", 87, "\x1B[33m87\x1B[39m");

    // gray uses "bright black"
    testFn("gray", 87, "\x1B[90m87\x1B[39m");
    testFn("grey", 87, "\x1B[90m87\x1B[39m");

    testFn("bold", 87, "\x1B[1m87\x1B[22m");
    testFn("dim", 87, "\x1B[2m87\x1B[22m");
    testFn("hidden", 87, "\x1B[8m87\x1B[28m");
    testFn("inverse", 87, "\x1B[7m87\x1B[27m");
    testFn("italic", 87, "\x1B[3m87\x1B[23m");
    testFn("strikethrough", 87, "\x1B[9m87\x1B[29m");
    testFn("underline", 87, "\x1B[4m87\x1B[24m");

    testFn("reset", 87, "\x1B[0m87\x1B[0m");
  });

  testFn("stripAnsi", 87, "87");

  testFn("quote", 87, '"87"');
});

// prettier-ignore
describe("path inputs", () => {
  describe("stuff from kleur", () => {
    testFn("bgBlack", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[40m/tmp/blah/bla\x1B[49m");
    testFn("bgBlue", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[44m/tmp/blah/bla\x1B[49m");
    testFn("bgCyan", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[46m/tmp/blah/bla\x1B[49m");
    testFn("bgGreen", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[42m/tmp/blah/bla\x1B[49m");
    testFn("bgMagenta", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[45m/tmp/blah/bla\x1B[49m");
    testFn("bgRed", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[41m/tmp/blah/bla\x1B[49m");
    testFn("bgWhite", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[47m/tmp/blah/bla\x1B[49m");
    testFn("bgYellow", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[43m/tmp/blah/bla\x1B[49m");

    testFn("black", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[30m/tmp/blah/bla\x1B[39m");
    testFn("blue", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[34m/tmp/blah/bla\x1B[39m");
    testFn("cyan", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[36m/tmp/blah/bla\x1B[39m");
    testFn("green", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[32m/tmp/blah/bla\x1B[39m");
    testFn("magenta", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[35m/tmp/blah/bla\x1B[39m");
    testFn("red", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[31m/tmp/blah/bla\x1B[39m");
    testFn("white", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[37m/tmp/blah/bla\x1B[39m");
    testFn("yellow", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[33m/tmp/blah/bla\x1B[39m");

    // gray uses "bright black"
    testFn("gray", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[90m/tmp/blah/bla\x1B[39m");
    testFn("grey", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[90m/tmp/blah/bla\x1B[39m");

    testFn("bold", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[1m/tmp/blah/bla\x1B[22m");
    testFn("dim", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[2m/tmp/blah/bla\x1B[22m");
    testFn("hidden", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[8m/tmp/blah/bla\x1B[28m");
    testFn("inverse", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[7m/tmp/blah/bla\x1B[27m");
    testFn("italic", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[3m/tmp/blah/bla\x1B[23m");
    testFn("strikethrough", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[9m/tmp/blah/bla\x1B[29m");
    testFn("underline", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[4m/tmp/blah/bla\x1B[24m");

    testFn("reset", { raw: `new Path("/tmp/blah/bla")` }, "\x1B[0m/tmp/blah/bla\x1B[0m");
  });

  testFn("stripAnsi", { raw: `new Path("/tmp/\x1B[90mblah\x1B[39m/bla")` }, "/tmp/blah/bla");
  testFn("stripAnsi", { raw: `new Path("/tmp/\x1B[30mblah\x1B[39m/bla")` }, "/tmp/blah/bla");
  testFn("stripAnsi", { raw: `new Path("/tmp/blah/bla")` }, "/tmp/blah/bla");

  testFn("quote", { raw: `new Path("/tmp/blah/bla")` }, '"/tmp/blah/bla"');
});
