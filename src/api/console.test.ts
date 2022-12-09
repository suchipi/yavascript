import { evaluate, inspect } from "../test-helpers";

test("console.log string", async () => {
  const result = await evaluate(`console.log("hi");`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi
    ",
    }
  `);
});

test("console.info string", async () => {
  const result = await evaluate(`console.info("hi");`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi
    ",
    }
  `);
});

test("console.warn string", async () => {
  const result = await evaluate(`console.warn("hi");`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hi
    ",
      "stdout": "",
    }
  `);
});

test("console.error string", async () => {
  const result = await evaluate(`console.error("hi");`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hi
    ",
      "stdout": "",
    }
  `);
});

test("console.log object", async () => {
  const result = await evaluate(`console.log({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      hi: true
    }
    ",
    }
  `);
});

test("console.info object", async () => {
  const result = await evaluate(`console.info({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      hi: true
    }
    ",
    }
  `);
});

test("console.warn object", async () => {
  const result = await evaluate(`console.warn({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "{
      hi: true
    }
    ",
      "stdout": "",
    }
  `);
});

test("console.error object", async () => {
  const result = await evaluate(`console.error({ hi: true });`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "{
      hi: true
    }
    ",
      "stdout": "",
    }
  `);
});

test("console.log multiple", async () => {
  const result = await evaluate(`console.log("hi", { hi: true }, "hi again");`);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi {
      hi: true
    } hi again
    ",
    }
  `);
});

test("console.info multiple", async () => {
  const result = await evaluate(
    `console.info("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "hi {
      hi: true
    } hi again
    ",
    }
  `);
});

test("console.warn multiple", async () => {
  const result = await evaluate(
    `console.warn("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hi {
      hi: true
    } hi again
    ",
      "stdout": "",
    }
  `);
});

test("console.error multiple", async () => {
  const result = await evaluate(
    `console.error("hi", { hi: true }, "hi again");`
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "hi {
      hi: true
    } hi again
    ",
      "stdout": "",
    }
  `);
});
