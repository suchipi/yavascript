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
      "stderr": "ArrayBuffer {
      │0x00000000│ 68 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21 21 21 20
      │0x00000010│ 3A 44 0A E3 81 82
    }
    ",
      "stdout": "",
    }
  `);
});

test("cat - multiple files - returns arraybuffer", async () => {
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
      "stderr": "ArrayBuffer {
      │0x00000000│ 68 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21 21 21 20
      │0x00000010│ 3A 44 0A E3 81 82 74 72 61 69 6C 69 6E 67 20 6E
      │0x00000020│ 65 77 6C 69 6E 65 20 69 6E 63 6F 6D 69 6E 67 0A
    }
    ",
      "stdout": "",
    }
  `);
});
