///<reference types="@test-it/core/globals" />
import path from "path";
import { evaluate, inspect, cleanResult } from "../../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..", "..");
const symlinksFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/symlinks"
);

test("readlink", async () => {
  const result = await evaluate(
    `JSON.stringify([readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")])`,
    { cwd: symlinksFixturesDir }
  );
  expect(cleanResult(result)).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      JSON.stringify(["./nowhere-real", "./some-file", "./some-folder"]) + "\n",
  });
});
