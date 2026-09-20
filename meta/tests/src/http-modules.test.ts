import * as http from "http";
import type { AddressInfo } from "net";
import { afterAll, beforeAll, expect, test } from "vitest";
import { evaluateWithTimeout, HANG_TIMEOUT } from "./test-helpers";

/**
 * vitest's own per-test timeout has to be comfortably above HANG_TIMEOUT, or
 * it fires first and the test reports a timeout instead of the real failure.
 */
const HANG_TEST_TIMEOUT = HANG_TIMEOUT * 4;

const JS = "application/javascript";

const FILES: { [path: string]: { contentType: string; body: string } } = {
  "/relative/main.js": {
    contentType: JS,
    body: `import { value } from "./dep.js";\nconsole.log("relative import:", value);\n`,
  },
  "/relative/dep.js": {
    contentType: JS,
    body: `export const value = 42;\n`,
  },
  "/root/main.js": {
    contentType: JS,
    body: `import { value } from "/root/dep.js";\nconsole.log("root-relative import:", value);\n`,
  },
  "/root/dep.js": {
    contentType: JS,
    body: `export const value = 7;\n`,
  },
  "/data.json": {
    contentType: "application/json",
    body: `{ "hello": "world" }\n`,
  },
};

let server: http.Server;
let origin: string;

beforeAll(async () => {
  server = http.createServer((request, response) => {
    const file = FILES[request.url ?? ""];
    if (file == null) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end(`no such file: ${request.url}`);
      return;
    }
    response.writeHead(200, { "Content-Type": file.contentType });
    response.end(file.body);
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err == null ? resolve() : reject(err)));
  });
});

test(
  "a url module can import a relative dependency",
  async () => {
    const result = await evaluateWithTimeout(
      `void import(${JSON.stringify(origin + "/relative/main.js")})`,
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "relative import: 42\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a url module can import a root-relative dependency",
  async () => {
    const result = await evaluateWithTimeout(
      `void import(${JSON.stringify(origin + "/root/main.js")})`,
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "root-relative import: 7\n",
    });
  },
  HANG_TEST_TIMEOUT,
);

test(
  "a url module honors the type attribute it is imported with",
  async () => {
    const result = await evaluateWithTimeout(
      `void import(${JSON.stringify(origin + "/data.json")}, { with: { type: "json" } })
        .then((mod) => { console.log(JSON.stringify(mod.default)); })`,
    );
    expect(result.timedOut).toBe(false);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: `{"hello":"world"}\n`,
    });
  },
  HANG_TEST_TIMEOUT,
);
