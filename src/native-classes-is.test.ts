import { evaluate } from "./test-helpers";

test("`is` uses instanceof for native classes", async () => {
  const result = await evaluate(
    `
      const path = new Path();
      const child = new ChildProcess(["true"]);
      const result = new ExecResult({ child, stdioType: null });

      echo([
        is(path, Path),
        is(child, ChildProcess),
        is(result, ExecResult),
      ]);
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      true
      true
      true
    ]
    ",
    }
  `);
});
