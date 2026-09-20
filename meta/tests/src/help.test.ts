import { expect, test } from "vitest";
import { evaluate } from "./test-helpers";

const docsUrl = (ref: string) =>
  `https://github.com/suchipi/yavascript/blob/${ref}/meta/generated-docs/README.md`;

test("help() links to the ref matching a pre-release version", async () => {
  const result = await evaluate(`
    for (const version of ["v1.0.0-rc.1", "v0.1.3-alpha"]) {
      yavascript.version = version;
      help();
    }
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout:
      `\nPlease see: ${docsUrl("v1.0.0-rc.1")}\n\n` +
      `\nPlease see: ${docsUrl("v0.1.3-alpha")}\n\n`,
  });
});
