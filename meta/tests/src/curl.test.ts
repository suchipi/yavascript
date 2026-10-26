import * as http from "node:http";
import { afterAll, beforeAll, expect, test } from "vitest";
import { evaluate } from "./test-helpers";

const TEST_SERVER_PORT = 9999;

let server: http.Server | null = null;
beforeAll(async () => {
  server = http.createServer((req, res) => {
    if (req.url === "/") {
      res.statusCode = 200;
      res.setHeader("Date", "omitted for snapshot consistency");
      res.end('{"yeah": true}');
    } else {
      res.statusCode = 404;
      res.setHeader("Date", "omitted for snapshot consistency");
      res.end('{"nah": false}');
    }
  });
  await new Promise<void>((resolve, reject) => {
    server!.once("error", (err) => {
      reject(err);
    });
    server!.listen(TEST_SERVER_PORT, resolve);
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server!.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  server = null;
});

test("curl - basic", async () => {
  const result = await evaluate(
    `
      {
        const result = curl("http://localhost:${TEST_SERVER_PORT}/");
        console.log(result);
        console.log("arrayBuffer", result.arrayBuffer());
        console.log("bytes", result.bytes());
        console.log("text", result.text());
        console.log("json", result.json());
      }

      {
        const result = curl("http://localhost:${TEST_SERVER_PORT}/nah");
        console.log(result);
        console.log("arrayBuffer", result.arrayBuffer());
        console.log("bytes", result.bytes());
        console.log("text", result.text());
        console.log("json", result.json());
      }
    `,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": null,
      "stderr": "",
      "stdout": "CurlResponse {
      status: 200
      headers: {
        date: [
          "omitted for snapshot consistency"
        ]
        connection: [
          "keep-alive"
        ]
        keep-alive: [
          "timeout=5"
        ]
        content-length: [
          "14"
        ]
      }
      ok: true
      _response: ArrayBuffer {
        │0x00000000│ 7B 22 79 65 61 68 22 3A 20 74 72 75 65 7D
      }
    }
    arrayBuffer ArrayBuffer {
      │0x00000000│ 7B 22 79 65 61 68 22 3A 20 74 72 75 65 7D
    }
    bytes Uint8Array [
      │0x00000000│ 7B 22 79 65 61 68 22 3A 20 74 72 75 65 7D
    ]
    text {"yeah": true}
    json {
      yeah: true
    }
    CurlResponse {
      status: 404
      headers: {
        date: [
          "omitted for snapshot consistency"
        ]
        connection: [
          "keep-alive"
        ]
        keep-alive: [
          "timeout=5"
        ]
        content-length: [
          "14"
        ]
      }
      ok: false
      _response: ArrayBuffer {
        │0x00000000│ 7B 22 6E 61 68 22 3A 20 66 61 6C 73 65 7D
      }
    }
    arrayBuffer ArrayBuffer {
      │0x00000000│ 7B 22 6E 61 68 22 3A 20 66 61 6C 73 65 7D
    }
    bytes Uint8Array [
      │0x00000000│ 7B 22 6E 61 68 22 3A 20 66 61 6C 73 65 7D
    ]
    text {"nah": false}
    json {
      nah: false
    }
    ",
    }
  `);
});
