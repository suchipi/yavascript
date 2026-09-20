import { describe, expect, test } from "vitest";
import { evaluate, runYavascript, rootDir } from "./test-helpers";

const detectionFixturesDir = rootDir.concat(
  "meta/tests/fixtures/cjs-detection",
);

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

describe("deciding whether a file is CommonJS", () => {
  test("a comment mentioning module.exports doesn't make a file CommonJS", async () => {
    const result = await runYavascript([
      detectionFixturesDir("comment-mention.js"),
    ]);
    expect(result).toMatchObject({ code: 0, stderr: "", stdout: "a,b\n" });
  });

  test("a file may declare its own module binding", async () => {
    const result = await runYavascript([
      detectionFixturesDir("own-module-binding.js"),
    ]);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout: "demo true\n",
    });
  });

  test("a string mentioning module.exports doesn't add CommonJS bindings", async () => {
    const result = await runYavascript([
      detectionFixturesDir("esm-string-mention.js"),
    ]);
    expect(result).toMatchObject({
      code: 0,
      stderr: "",
      stdout:
        "module.exports is how CommonJS does this\nmodule is undefined and exports is undefined\n",
    });
  });
});
