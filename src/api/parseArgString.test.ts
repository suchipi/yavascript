///<reference types="@test-it/core/globals" />
import { parseArgString } from "./parseArgString";

test("parseArgString: no quotes", () => {
  expect(parseArgString("hi there world")).toEqual(["hi", "there", "world"]);
});

test("parseArgString: with single quotes (no escape)", () => {
  expect(parseArgString(`hi 'there world' 'yeah' mhm`)).toEqual([
    "hi",
    "there world",
    "yeah",
    "mhm",
  ]);
});

test("parseArgString: with single quotes (with escaped single quote)", () => {
  expect(parseArgString(`hi 'there world\\'' 'yeah' mhm`)).toEqual([
    "hi",
    "there world'",
    "yeah",
    "mhm",
  ]);
});

test("parseArgString: with single quotes (with unnecessarily-escaped double quote)", () => {
  expect(parseArgString(`hi 'there world\\"' 'yeah' mhm`)).toEqual([
    "hi",
    'there world"',
    "yeah",
    "mhm",
  ]);
});

test("parseArgString: with double quotes (with escaped double quote)", () => {
  expect(parseArgString(`hi "there world\\"" 'yeah' mhm`)).toEqual([
    "hi",
    'there world"',
    "yeah",
    "mhm",
  ]);
});

test("parseArgString: with double quotes (with unnecessarily-escaped single quote)", () => {
  expect(parseArgString(`hi "there world\\'" 'yeah' mhm`)).toEqual([
    "hi",
    "there world'",
    "yeah",
    "mhm",
  ]);
});

test("parseArgString: escaped characters in single quotes", () => {
  // \w is not an escape sequence, and should just become 'w'
  expect(parseArgString(`'\\n \\r \\v \\t \\0 \\\\ \\w'`)).toEqual([
    "\n \r \v \t \0 \\ w",
  ]);
});

test("parseArgString: escaped characters in double quotes", () => {
  // \w is not an escape sequence, and should just become 'w'
  expect(parseArgString(`"\\n \\r \\v \\t \\0 \\\\ \\w"`)).toEqual([
    "\n \r \v \t \0 \\ w",
  ]);
});

test("parseArgString: escaped characters outside of string", () => {
  expect(parseArgString(`\\n \\r \\v \\t \\0 \\\\ \\w`)).toEqual([
    "\\n",
    "\\r",
    "\\v",
    "\\t",
    "\\0",
    "\\\\",
    "\\w",
  ]);
});

test("parseArgString: string gluing", () => {
  expect(
    parseArgString(
      `one two'three' four"five"'six' "seven""eight" nine"ten" 'eleven''twelve'`
    )
  ).toEqual([
    "one",
    "twothree",
    "fourfivesix",
    "seveneight",
    "nineten",
    "eleventwelve",
  ]);
});

test("parseArgString: multiline without backslashes", () => {
  expect(
    parseArgString(`ffmpeg
-i something
somethingelse.mp4
`)
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("parseArgString: multiline with backslashes that were probably meant to be bash-style line escapes", () => {
  expect(
    parseArgString(`
ffmpeg \\
-i something \\
somethingelse.mp4
`)
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("parseArgString: multiline with escaped newlines that were probably meant to be bash-style line escapes", () => {
  expect(
    parseArgString(`ffmpeg \
-i something \
somethingelse.mp4
`)
  ).toEqual(["ffmpeg", "-i", "something", "somethingelse.mp4"]);
});

test("parseArgString: consecutive whitespace", () => {
  expect(
    parseArgString(
      `a        b  \n\n\t\nc\t\t\td\v\v\ve     f\r\ng\r\n\r\n\r\nh`
    )
  ).toEqual(["a", "b", "c", "d", "e", "f", "g", "h"]);
});

test("parseArgString does not interpolate env vars", () => {
  expect(parseArgString(`$HI '$HI' "$HI"`)).toEqual(["$HI", "$HI", "$HI"]);
});

test("parseArgString does not expand globs", () => {
  expect(parseArgString(`./**/* './**/*' "./**/*"`)).toEqual([
    "./**/*",
    "./**/*",
    "./**/*",
  ]);
});
