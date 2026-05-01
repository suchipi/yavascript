import { evaluate } from "./test-helpers";

test("yavascript (global API)", async () => {
  const result = await evaluate(
    `
      const { version, arch, ...others } = yavascript;
      assert(typeof version === "string");
      assert(typeof arch === "string");
      console.log({
        version: "omitted from snapshot due to variance",
        arch: "omitted from snapshot due to variance",
        ...others,
      });
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     version: "omitted from snapshot due to variance"
     arch: "omitted from snapshot due to variance"
     ecmaVersion: "ES2023"
     compilers: {
       js: Function "js" {}
       tsx: Function "tsx" {}
       ts: Function "ts" {}
       jsx: Function "jsx" {}
       coffee: Function "coffee" {}
       civet: Function "civet" {}
       autodetect: Function "autodetect" {}
       esmToCjs: Function "esmToCjs" {}
     }
     getTypesDts: Function "getTypesDts" {}
   }
   ",
   }
  `);
});

test("yavascript (global API)", async () => {
  const result = await evaluate(
    `
      const typesDts = yavascript.getTypesDts();
      assert(typeof typesDts === "string");
      console.log(typesDts.slice(0, 95))
    `,
  );
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "// ===============
   // ---------------
   // YavaScript APIs
   // ---------------
   // ===============

   ",
   }
  `);
});
