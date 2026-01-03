import { evaluate, rootDir } from "./test-helpers";

const symlinksFixturesDir = rootDir("meta/tests/fixtures/symlinks");

test("readlink", async () => {
  const result = await evaluate(
    `[readlink("dead-link"), readlink("link-to-file"), readlink("link-to-folder")]`,
    { cwd: symlinksFixturesDir },
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      Path { ./nowhere-real }
      Path { ./some-file }
      Path { ./some-folder }
    ]
    ",
    }
  `);
});
