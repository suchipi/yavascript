import path from "path";
import { evaluate } from "../../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..", "..");
const symlinksFixturesDir = path.join(
  rootDir,
  "src/api/test_fixtures/symlinks"
);

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
