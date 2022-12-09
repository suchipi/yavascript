import { evaluate } from "../test-helpers";

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
