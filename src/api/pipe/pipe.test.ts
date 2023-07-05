import path from "node:path";
import { evaluate, rootDir } from "../../test-helpers";

test("string -> new Uint8Array", async () => {
  const input = { data: "Hello, world!" };
  const result = await evaluate(`pipe(${JSON.stringify(input)}, Uint8Array)`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 13
      target: Uint8Array [
        │0x00000000│ 48 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21
      ]
    }
    ",
    }
  `);
});

test("string -> existing Uint8Array (exact size)", async () => {
  const input = { data: "Hello, world!" };
  const outputBytes = [
    0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64,
    0x21,
  ];

  const result = await evaluate(
    `pipe(${JSON.stringify(input)}, new Uint8Array(${outputBytes.length}))`
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 13
      target: Uint8Array [
        │0x00000000│ 48 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21
      ]
    }
    ",
    }
  `);
});

test("string -> existing Uint8Array (smaller; truncates)", async () => {
  const input = { data: "Hello, world!" };
  const outputBytes = [
    0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64,
    0x21,
  ];

  const result = await evaluate(
    `pipe(${JSON.stringify(input)}, new Uint8Array(${outputBytes.length - 4}))`
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 9
      target: Uint8Array [
        │0x00000000│ 48 65 6C 6C 6F 2C 20 77 6F
      ]
    }
    ",
    }
  `);
});

test("string -> existing Uint8Array (larger; overwrites but leaves existing data alone)", async () => {
  const input = { data: "Hello, world!" };
  const outputBytes = [
    0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64,
    0x21,
  ];

  const result = await evaluate(
    `pipe(${JSON.stringify(input)}, new Uint8Array(new Array(${
      outputBytes.length + 4
    }).fill(1)))`
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 13
      target: Uint8Array [
        │0x00000000│ 48 65 6C 6C 6F 2C 20 77 6F 72 6C 64 21 01 01 01
        │0x00000010│ 01
      ]
    }
    ",
    }
  `);
});

// TODO: every other combination of input/output...

test("can handle NUL byte in content", async () => {
  // NES ROM Header :3
  const input = [
    0x4e, 0x45, 0x53, 0x1a, 0x02, 0x02, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ];

  const result = await evaluate(
    `pipe(new Uint8Array(${JSON.stringify(input)}), Uint8Array)`
  );

  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 16
      target: Uint8Array [
        │0x00000000│ 4E 45 53 1A 02 02 11 00 00 00 00 00 00 00 00 00
      ]
    }
    ",
    }
  `);
});

test("Path -> string", async () => {
  const result = await evaluate(
    `pipe(new Path(${JSON.stringify(
      rootDir("src/test_fixtures/logging/log-three.coffee")
    )}), String)`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 20
      target: "console.log "three"\\n"
    }
    ",
    }
  `);
});

test("Path -> new Uint8Array", async () => {
  const result = await evaluate(
    `pipe(new Path(${JSON.stringify(
      rootDir("src/test_fixtures/logging/log-three.coffee")
    )}), Uint8Array)`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      bytesTransferred: 20
      target: Uint8Array [
        │0x00000000│ 63 6F 6E 73 6F 6C 65 2E 6C 6F 67 20 22 74 68 72
        │0x00000010│ 65 65 22 0A
      ]
    }
    ",
    }
  `);
});
