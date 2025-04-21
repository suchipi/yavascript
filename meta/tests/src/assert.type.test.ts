import { evaluate } from "./test-helpers";

test("assert.type - global constructor, pass", async () => {
  const result = await evaluate(`
    assert.type(2, number);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("assert.type - types namespace, pass", async () => {
  const result = await evaluate(`
    assert.type(2, types.number);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("assert.type - global constructor, fail", async () => {
  const result = await evaluate(`
    assert.type(2, string);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "TypeError: Expected value of type string, but received 2
      at somewhere
    ",
      "stdout": "",
    }
  `);
});

test("assert.type - types.namespace, fail", async () => {
  const result = await evaluate(`
    assert.type(2, types.string);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "TypeError: Expected value of type string, but received 2
      at somewhere
    ",
      "stdout": "",
    }
  `);
});

test("assert.type - custom class, pass", async () => {
  const result = await evaluate(`
    class Something {}
    const something = new Something();

    assert.type(something, Something);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "",
    }
  `);
});

test("assert.type - custom class, fail", async () => {
  const result = await evaluate(`
    class Something {}
    assert.type(null, Something);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "TypeError: Expected value of type instanceOf(Something), but received null
      at somewhere
    ",
      "stdout": "",
    }
  `);
});
