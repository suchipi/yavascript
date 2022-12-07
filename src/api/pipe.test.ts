import { cleanResult, evaluate, inspect } from "../test-helpers";

test("string -> new Uint8Array", async () => {
  const input = { data: "Hello, world!" };
  const outputBytes = [
    0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64,
    0x21,
  ];

  const result = await evaluate(`pipe(${JSON.stringify(input)}, Uint8Array)`);

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stdout:
      inspect({
        bytesTransferred: outputBytes.length,
        target: new Uint8Array(outputBytes),
      }) + "\n",
    stderr: "",
  });
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

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stdout:
      inspect({
        bytesTransferred: outputBytes.length,
        target: new Uint8Array(outputBytes),
      }) + "\n",
    stderr: "",
  });
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

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stdout:
      inspect({
        bytesTransferred: outputBytes.length - 4,
        target: new Uint8Array(outputBytes.slice(0, -4)),
      }) + "\n",
    stderr: "",
  });
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

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stdout:
      inspect({
        bytesTransferred: outputBytes.length,
        target: new Uint8Array([...outputBytes, 0x01, 0x01, 0x01, 0x01]),
      }) + "\n",
    stderr: "",
  });
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

  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stdout:
      inspect({
        bytesTransferred: 16,
        target: new Uint8Array(input),
      }) + "\n",
    stderr: "",
  });
});
