import { evaluate } from "./test-helpers";

test("exit - direct call", async () => {
  const result1 = await evaluate(`exit(0)`);
  expect(result1).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);

  const result2 = await evaluate(`exit(1)`);
  expect(result2).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);

  const result3 = await evaluate(`exit(3)`);
  expect(result3).toMatchInlineSnapshot(`
    {
      "code": 3,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("exit - call without arg", async () => {
  const result1 = await evaluate(`exit()`);
  expect(result1).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);

  const result2 = await evaluate(`exit.code = 1; exit()`);
  expect(result2).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);

  const result3 = await evaluate(`exit.code = 2; exit()`);
  expect(result3).toMatchInlineSnapshot(`
    {
      "code": 2,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("exit.code - default value", async () => {
  const result = await evaluate(`console.log(exit.code)`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "0
    ",
    }
  `);
});

test("exit.code - normal exit after set", async () => {
  const result1 = await evaluate(`exit.code = 0; console.log("yeah")`);
  expect(result1).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);

  const result2 = await evaluate(`exit.code = 1; console.log("yeah")`);
  expect(result2).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);

  const result3 = await evaluate(`exit.code = 2; console.log("yeah")`);
  expect(result3).toMatchInlineSnapshot(`
    {
      "code": 2,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);

  const result4 = await evaluate(
    `exit.code = 17; void setTimeout(() => { console.log('okay') }, 30);`
  );
  expect(result4).toMatchInlineSnapshot(`
    {
      "code": 17,
      "error": false,
      "stderr": "",
      "stdout": "okay
    ",
    }
  `);
});
