import fs from "fs";
import path from "path";
import { evaluate, inspect } from "../../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..", "..");
const fileContentFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/file_content"
);

const hello = "hello, world!!! :D\nあ";
const hello2 = "trailing newline incoming\n";

test("cat - single file - prints to stdout", async () => {
  const result = await evaluate(
    `
    cat('hello.txt');
    void 0;
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: hello,
  });
});

test("cat - single file - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat('hello.txt');
    console.error(result);
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: hello + "\n",
    stdout: hello,
  });
});

test("cat - multiple files - prints to stdout", async () => {
  const result = await evaluate(
    `
    cat('hello.txt', 'hello2.txt');
    void 0;
  `,
    { cwd: fileContentFixturesDir }
  );

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: hello + hello2,
  });
});

test("cat - multiple files - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat('hello.txt', 'hello2.txt');
    console.error(result);
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: hello + hello2 + "\n",
    stdout: hello + hello2,
  });
});
