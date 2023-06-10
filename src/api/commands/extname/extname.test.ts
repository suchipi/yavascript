import { evaluate } from "../../../test-helpers";

test("extname", async () => {
  const script = `
    echo(extname("something.js"));
    echo(extname("/tmp/somewhere/something.js"));

    echo(extname("something.test.js"));
    echo(extname("/tmp/somewhere/something.test.js"));

    echo(extname("something.test.js", { full: true }));
    echo(extname("/tmp/somewhere/something.test.js", { full: true }));

    echo(extname("something.test.js", { full: false }));
    echo(extname("/tmp/somewhere/something.test.js", { full: false }));

    echo(extname("Makefile"));
    echo(extname("Makefile", { full: false }));
    echo(extname("Makefile", { full: true }));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".js
    .js
    .js
    .js
    .test.js
    .test.js
    .js
    .js



    ",
    }
  `);
});

test("extname (windows-style path)", async () => {
  const script = `
    echo(extname("E:\\\\somewhere\\\\something.js"));
    echo(extname("E:\\\\somewhere\\\\something.test.js"));
    echo(extname("E:\\\\somewhere\\\\something.test.js", { full: true }));
    echo(extname("E:\\\\somewhere\\\\something.test.js", { full: false }));
  `;

  const result = await evaluate(script);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": ".js
    .js
    .test.js
    .js
    ",
    }
  `);
});
