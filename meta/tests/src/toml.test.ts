import { evaluate } from "./test-helpers";

test("TOML.parse", async () => {
  const result = await evaluate(
    `
      const doc = \`
        ayo = 99

        [something]
        yeah = 4
        
        [something.mhm]
        yes=99
      \`;
      const obj = TOML.parse(doc);
      console.log(obj);
    `,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      ayo: 99
      something: {
        yeah: 4
        mhm: {
          yes: 99
        }
      }
    }
    ",
    }
  `);
});

test("TOML.stringify", async () => {
  const result = await evaluate(
    `
      const obj = {
        ayo: 99,
        something: {
          yeah: 4,
          mhm: {
            yes: 99
          }
        }
      };
      const doc = TOML.stringify(obj);
      console.log(doc);
    `,
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "ayo = 99

    [something]
    yeah = 4

      [something.mhm]
      yes = 99

    ",
    }
  `);
});
