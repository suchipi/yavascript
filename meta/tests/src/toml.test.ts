import { expect, test } from "vitest";
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
     "error": null,
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
     "error": null,
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

test("TOML.parse - a local time followed by another line", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(TOML.parse("t = 07:32:00\\nl = 1")))`,
  );
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '{"t":"07:32:00.000","l":1}\n',
  });
});

test("TOML.parse - local times in an array", async () => {
  const result = await evaluate(
    `console.log(JSON.stringify(TOML.parse("x = [07:32:00, 08:00:00]")))`,
  );
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: '{"x":["07:32:00.000","08:00:00.000"]}\n',
  });
});

test("TOML.parse - an integer too big for int64 is an error", async () => {
  const result = await evaluate(`
    try {
      console.log("parsed:", String(TOML.parse("n = 9223372036854775808").n));
    } catch (err) {
      console.log("threw");
    }
  `);
  expect(result).toEqual({
    code: 0,
    error: null,
    stderr: "",
    stdout: "threw\n",
  });
});
