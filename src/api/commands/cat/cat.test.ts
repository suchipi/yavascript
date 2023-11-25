import path from "path";
import { evaluate, rootDir } from "../../../test-helpers";

const fileContentFixturesDir = path.join(
  rootDir(),
  "src/test_fixtures/file_content"
);

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
      "stdout": "",
    }
  `);
});

test("cat - multiple files - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat(['hello.txt', 'hello2.txt']);
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
      "stdout": "",
    }
  `);
});

test("cat - single file - returns arraybuffer", async () => {
  const result = await evaluate(
    `
    const result = cat('hello.txt', { binary: true });
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
      "stdout": "",
    }
  `);
});

test("cat - multiple files - returns string", async () => {
  const result = await evaluate(
    `
    const result = cat(['hello.txt', 'hello2.txt'], { binary: true });
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
      "stdout": "",
    }
  `);
});
