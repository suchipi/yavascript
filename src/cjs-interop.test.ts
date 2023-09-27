import { evaluate } from "./test-helpers";

describe("wrapping code for CommonJS interop", () => {
  test("module.exports = something", async () => {
    const code = `module.exports = something`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } }); module.exports = something
      export { __isCjsModule }; export const __cjsExports = module.exports;
      ",
      }
    `);
  });

  test("exports.something = whatever", async () => {
    const code = `exports.something = whatever`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } }); exports.something = whatever
      export { __isCjsModule }; export const __cjsExports = module.exports;
      ",
      }
    `);
  });

  test("Object.defineProperty(exports, 'yeah', void 0);", async () => {
    const code = `Object.defineProperty(exports, 'yeah', void 0);`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } }); Object.defineProperty(exports, 'yeah', void 0);
      export { __isCjsModule }; export const __cjsExports = module.exports;
      ",
      }
    `);
  });

  test('Object.defineProperty(exports, "yeah", void 0);', async () => {
    const code = `Object.defineProperty(exports, "yeah", void 0);`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "let __isCjsModule = false; const exports = new Proxy({}, {   set(obj, prop, value) {     __isCjsModule = true;     return Reflect.set(obj, prop, value);   } }); const module = new Proxy({   exports,   id: __filename }, {   set(obj, prop, value) {     if (prop === "exports") {       __isCjsModule = true;     }     return Reflect.set(obj, prop, value);   } }); Object.defineProperty(exports, "yeah", void 0);
      export { __isCjsModule }; export const __cjsExports = module.exports;
      ",
      }
    `);
  });

  test("normal ESM code", async () => {
    const code = `export const five = 5;`;
    const result = await evaluate(
      `yavascript.compilers.js(${JSON.stringify(code)})`
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "export const five = 5;
      ",
      }
    `);
  });
});
