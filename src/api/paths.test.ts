///<reference types="@test-it/core/globals" />
import path from "path";
import { evaluate, cleanResult, inspect } from "../test-helpers";

const rootDir = path.resolve(__dirname, "..", "..");
const symlinkFixturesDir = path.join(rootDir, "src/api/test_fixtures/symlinks");

test("cd and pwd", async () => {
  const script = `
    echo(pwd());
    cd("src");
    echo(pwd());
    cd("..");
    echo(pwd());
    cd("./scripts");
    echo(pwd());
    cd("/tmp");
    echo(pwd());
  `;

  const result = await evaluate(script, { cwd: rootDir });

  result.stdout = result.stdout.replace(new RegExp(rootDir, "g"), "<rootDir>");

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      [
        "<rootDir>",
        "<rootDir>/src",
        "<rootDir>",
        "<rootDir>/scripts",
        "/tmp",
      ].join("\n") + "\n",
  });
});

test("cd affects working directory of exec", async () => {
  const script = `
    cd("src");
    exec(["sh", "-c", "echo $PWD"]);
  `;

  const result = await evaluate(script, { cwd: rootDir });

  result.stdout = result.stdout.replace(new RegExp(rootDir, "g"), "<rootDir>");

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "<rootDir>/src\n",
  });
});

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

    cd(${JSON.stringify(rootDir)});
    echo(realpath("./src/.."));
  `;

  const result = await evaluate(script, { cwd: rootDir });

  result.stdout = result.stdout.replace(new RegExp(rootDir, "g"), "<rootDir>");

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout:
      [
        "/tmp",
        "<rootDir>/src/api/test_fixtures/symlinks",
        "<rootDir>/src/api/test_fixtures",

        "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/some-file",
        "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/some-file",

        "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/some-file",
        "<rootDir>/src/api/test_fixtures/symlinks/some-folder",
        "<rootDir>/src/api/test_fixtures/symlinks/some-file",

        "<rootDir>",
      ].join("\n") + "\n",
  });
});

test("realpath against dead link throws error", async () => {
  const result = await evaluate(`realpath("./dead-link")`, {
    cwd: symlinkFixturesDir,
  });

  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stdout: "",
    stderr:
      [
        `Error: No such file or directory (errno = 2, path = ./dead-link)`,
        `  at realpath (native)`,
        `  at realpath (yavascript-internal.js)`,
        `  at <eval> (<evalScript>) ${inspect({
          errno: 2,
          path: "./dead-link",
        })}`,
      ].join("\n") + "\n",
  });
});

test("realpath against non-existent target throws error", async () => {
  const result = await evaluate(`realpath("./this doesn't exist, bro")`, {
    cwd: rootDir,
  });

  expect(cleanResult(result)).toEqual({
    code: 1,
    error: false,
    stdout: "",
    stderr:
      [
        `Error: No such file or directory (errno = 2, path = ./this doesn't exist, bro)`,
        `  at realpath (native)`,
        `  at realpath (yavascript-internal.js)`,
        `  at <eval> (<evalScript>) ${inspect({
          errno: 2,
          path: "./this doesn't exist, bro",
        })}`,
      ].join("\n") + "\n",
  });
});

test("paths.resolve with already-absolute path", async () => {
  const result = await evaluate(`paths.resolve("/hi/there/yeah")`);

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "/hi/there/yeah\n",
  });
});

test("paths.resolve with absolute path with . and ..s in it", async () => {
  const result = await evaluate(`paths.resolve("/hi/./there/yeah/../yup/./")`);

  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "/hi/there/yup\n",
  });
});
