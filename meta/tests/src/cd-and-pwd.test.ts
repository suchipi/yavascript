import { evaluate, rootDir } from "./test-helpers";

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
      "stderr": "exec: sh -c "echo $PWD"
    ",
      "stdout": "<rootDir>/src
    ",
    }
  `);
});

test("cd does not change pwd.initial", async () => {
  const script = `
    echo(pwd());
    echo(pwd.initial);
    cd("src");
    echo(pwd());
    echo(pwd.initial);
  `;

  const result = await evaluate(script, { cwd: rootDir() });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Path { <rootDir> }
    Path {
      Frozen
      <rootDir>
    }
    Path { <rootDir>/src }
    Path {
      Frozen
      <rootDir>
    }
    ",
    }
  `);
});

test("pwd.initial cannot be modified", async () => {
  const script = `
    echo(1, pwd.initial);
    pwd.initial = pwd.initial.concat("hmm?");
    echo(2, pwd.initial);
    pwd.initial.separator = "blah";
    echo(3, pwd.initial);
    pwd.initial.segments.push("hmm?"); // this one throws
    echo(4, pwd.initial);
  `;

  const result = await evaluate(script, { cwd: rootDir() });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "TypeError: object is not extensible
      at somewhere
    ",
      "stdout": "1 Path {
      Frozen
      <rootDir>
    }
    2 Path {
      Frozen
      <rootDir>
    }
    3 Path {
      Frozen
      <rootDir>
    }
    ",
    }
  `);
});
