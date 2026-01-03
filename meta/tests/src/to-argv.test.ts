import { evaluate, binaryPath, inspect, cleanResult } from "./test-helpers";

async function toArgv(str: string) {
  const result = await evaluate(
    `JSON.stringify(exec.toArgv(${JSON.stringify(str)}))`,
  );
  if (result.code !== 0) {
    throw new Error(`toArgv failed: ${JSON.stringify(result, null, 2)}`);
  }
  return JSON.parse(result.stdout);
}

test("no quotes", async () => {
  expect(await toArgv("hi there world")).toEqual(["hi", "there", "world"]);
});

test("with single quotes (no escape)", async () => {
  expect(await toArgv(`hi 'there world' 'yeah' mhm`)).toEqual([
    "hi",
    "there world",
    "yeah",
    "mhm",
  ]);
});

test("with single quotes (with escaped single quote)", async () => {
  expect(await toArgv(`hi 'there world\\'' 'yeah' mhm`)).toEqual([
    "hi",
    "there world'",
    "yeah",
    "mhm",
  ]);
});

test("with single quotes (with unnecessarily-escaped double quote)", async () => {
  expect(await toArgv(`hi 'there world\\"' 'yeah' mhm`)).toEqual([
    "hi",
    'there world"',
    "yeah",
    "mhm",
  ]);
});

test("with double quotes (with escaped double quote)", async () => {
  expect(await toArgv(`hi "there world\\"" 'yeah' mhm`)).toEqual([
    "hi",
    'there world"',
    "yeah",
    "mhm",
  ]);
});

test("with double quotes (with unnecessarily-escaped single quote)", async () => {
  expect(await toArgv(`hi "there world\\'" 'yeah' mhm`)).toEqual([
    "hi",
    "there world'",
    "yeah",
    "mhm",
  ]);
});

test("escaped characters in single quotes", async () => {
  // \w is not an escape sequence, and should just become 'w'
  expect(await toArgv(`'\\n \\r \\v \\t \\0 \\\\ \\w'`)).toEqual([
    "\n \r \v \t \0 \\ w",
  ]);
});

test("escaped characters in double quotes", async () => {
  // \w is not an escape sequence, and should just become 'w'
  expect(await toArgv(`"\\n \\r \\v \\t \\0 \\\\ \\w"`)).toEqual([
    "\n \r \v \t \0 \\ w",
  ]);
});

test("escaped characters outside of string", async () => {
  expect(await toArgv(`\\n \\r \\v \\t \\0 \\\\ \\w`)).toEqual([
    "\\n",
    "\\r",
    "\\v",
    "\\t",
    "\\0",
    "\\\\",
    "\\w",
  ]);
});

test("string gluing", async () => {
  expect(
    await toArgv(
      `one two'three' four"five"'six' "seven""eight" nine"ten" 'eleven''twelve'`,
    ),
  ).toEqual([
    "one",
    "twothree",
    "fourfivesix",
    "seveneight",
    "nineten",
    "eleventwelve",
  ]);
});

test("multiline without backslashes", async () => {
  expect(
    await toArgv(`ffmpeg
-i something
somethingelse.mp4
`),
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("multiline with backslashes that were probably meant to be bash-style line escapes", async () => {
  expect(
    await toArgv(`
ffmpeg \\
-i something \\
somethingelse.mp4
`),
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("multiline with escaped newlines that were probably meant to be bash-style line escapes", async () => {
  expect(
    await toArgv(`ffmpeg \
-i something \
somethingelse.mp4
`),
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("consecutive whitespace", async () => {
  expect(
    await toArgv(`a        b  \n\n\t\nc\t\t\td\v\v\ve     f\r\ng\r\n\r\n\r\nh`),
  ).toEqual(["a", "b", "c", "d", "e", "f", "g", "h"]);
});

test("does not interpolate env vars", async () => {
  expect(await toArgv(`$HI '$HI' "$HI"`)).toEqual(["$HI", "$HI", "$HI"]);
});

test("does not expand globs", async () => {
  expect(await toArgv(`./**/* './**/*' "./**/*"`)).toEqual([
    "./**/*",
    "./**/*",
    "./**/*",
  ]);
});
