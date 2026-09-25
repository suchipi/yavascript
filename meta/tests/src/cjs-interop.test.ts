import { describe, expect, test } from "vitest";
import { evaluate } from "./test-helpers";

describe("wrapping code for CommonJS interop", () => {
  test("module.exports = something", async () => {
    const code = `module.exports = something`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`,
    );
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } });
     module.exports = something
     export { __isCjsModule }; export const __cjsExports = module.exports;
     ",
     }
    `);
  });

  test("exports.something = whatever", async () => {
    const code = `exports.something = whatever`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`,
    );
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } });
     exports.something = whatever
     export { __isCjsModule }; export const __cjsExports = module.exports;
     ",
     }
    `);
  });

  test("Object.defineProperty(exports, 'yeah', void 0);", async () => {
    const code = `Object.defineProperty(exports, 'yeah', void 0);`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`,
    );
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } });
     Object.defineProperty(exports, 'yeah', void 0);
     export { __isCjsModule }; export const __cjsExports = module.exports;
     ",
     }
    `);
  });

  test('Object.defineProperty(exports, "yeah", void 0);', async () => {
    const code = `Object.defineProperty(exports, "yeah", void 0);`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`,
    );
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } });
     Object.defineProperty(exports, "yeah", void 0);
     export { __isCjsModule }; export const __cjsExports = module.exports;
     ",
     }
    `);
  });

  test("normal ESM code", async () => {
    const code = `export const five = 5;`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`,
    );
    expect(result).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "export const five = 5;
     ",
     }
    `);
  });
});

describe("require of an ES module", () => {
  test("a module whose only export is default requires to the namespace", async () => {
    const result = await evaluate(`
      const mod = require("./meta/tests/fixtures/repl-imports/only-default-esm.js");
      console.log(JSON.stringify({
        keys: Object.keys(mod),
        default: mod.default,
      }));
    `);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: `{"keys":["default"],"default":{"iAm":"the default export"}}\n`,
    });
  });

  test("a JSON file required through an import attribute gives the parsed data", async () => {
    const result = await evaluate(`
      const data = require("./meta/tests/fixtures/repl-imports/data.json", { type: "json" });
      console.log(JSON.stringify(data));
    `);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: `{"a":1,"b":[1,2]}\n`,
    });
  });
});
