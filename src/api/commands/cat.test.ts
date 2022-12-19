import path from "path";
import { evaluate } from "../../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..", "..");
const fileContentFixturesDir = path.join(
  rootDir,
  "src/test_fixtures/file_content"
);

test("cat - single file - prints to stdout", async () => {
  const result = await evaluate(
    `
    cat('hello.txt');
    void 0;
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hello, world!!! :D
    あ",
    }
  `);
});

test("cat - single file - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat('hello.txt');
    console.error(result);
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hello, world!!! :D
    あ
    ",
      "stdout": "hello, world!!! :D
    あ",
    }
  `);
});

test("cat - multiple files - prints to stdout", async () => {
  const result = await evaluate(
    `
    cat('hello.txt', 'hello2.txt');
    void 0;
  `,
    { cwd: fileContentFixturesDir }
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hello, world!!! :D
    あtrailing newline incoming
    ",
    }
  `);
});

test("cat - multiple files - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat('hello.txt', 'hello2.txt');
    console.error(result);
  `,
    { cwd: fileContentFixturesDir }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hello, world!!! :D
    あtrailing newline incoming

    ",
      "stdout": "hello, world!!! :D
    あtrailing newline incoming
    ",
    }
  `);
});
