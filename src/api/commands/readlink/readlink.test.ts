import path from "path";
import { evaluate, rootDir } from "../../../test-helpers";

const symlinksFixturesDir = path.join(rootDir(), "src/test_fixtures/symlinks");

test("readlink", async () => {
  const result = await evaluate(
    `[readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")]`,
    { cwd: symlinksFixturesDir }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      "./nowhere-real"
      "./some-file"
      "./some-folder"
    ]
    ",
    }
  `);
});
