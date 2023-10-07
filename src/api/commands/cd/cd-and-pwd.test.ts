import { evaluate, rootDir } from "../../../test-helpers";

test("cd and pwd", async () => {
  const script = `
    echo(pwd());
    cd("src");
    echo(pwd());
    cd("..");
    echo(pwd());
    cd("./meta");
    echo(pwd());
    cd("/tmp");
    echo(pwd());
  `;

  const result = await evaluate(script, { cwd: rootDir() });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { <rootDir> }
    Path { <rootDir>/src }
    Path { <rootDir> }
    Path { <rootDir>/meta }
    Path { /tmp }
    ",
    }
  `);
});

test("cd affects working directory of exec", async () => {
  const script = `
    cd("src");
    exec(["sh", "-c", "echo $PWD"]);
  `;

  const result = await evaluate(script, { cwd: rootDir() });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "<rootDir>/src
    ",
    }
  `);
});
