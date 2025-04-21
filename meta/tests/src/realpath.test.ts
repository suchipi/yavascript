import { evaluate, rootDir } from "./test-helpers";

const symlinkFixturesDir = rootDir("meta/tests/fixtures/symlinks");

test("realpath resolution behavior", async () => {
  const script = `
    echo(realpath("/tmp"));

    cd(${JSON.stringify(symlinkFixturesDir)});

    echo(realpath("."));
    echo(realpath(".."));

    echo(realpath("./link-to-folder"));
    echo(realpath("./link-to-file"));
    echo(realpath("./some-folder"));
    echo(realpath("./some-file"));

    echo(realpath("link-to-folder"));
    echo(realpath("link-to-file"));
    echo(realpath("some-folder"));
    echo(realpath("some-file"));

    cd(${JSON.stringify(rootDir())});
    echo(realpath("./src/.."));
  `;

  const result = await evaluate(script, { cwd: rootDir() });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { /tmp }
    Path { <rootDir>/meta/tests/fixtures/symlinks }
    Path { <rootDir>/meta/tests/fixtures }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-folder }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-file }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-folder }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-file }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-folder }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-file }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-folder }
    Path { <rootDir>/meta/tests/fixtures/symlinks/some-file }
    Path { <rootDir> }
    ",
    }
  `);
});

test("realpath against dead link throws error", async () => {
  const result = await evaluate(`realpath("./dead-link")`, {
    cwd: symlinkFixturesDir,
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: No such file or directory (errno = 2, path = ./dead-link)
      at somewhere
    {
      errno: 2
      path: "./dead-link"
    }
    ",
      "stdout": "",
    }
  `);
});

test("realpath against non-existent target throws error", async () => {
  const result = await evaluate(`realpath("./this doesn't exist, bro")`, {
    cwd: rootDir(),
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: No such file or directory (errno = 2, path = ./this doesn't exist, bro)
      at somewhere
    {
      errno: 2
      path: "./this doesn't exist, bro"
    }
    ",
      "stdout": "",
    }
  `);
});
