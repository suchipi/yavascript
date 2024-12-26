import { evaluate, cleanResult } from "../../test-helpers";

test("help text coverage of 'Path' class", async () => {
  const result = await evaluate(`
    console.log(); // print newline first so inline snapshot is more readable

    for (const key of Object.keys(Object.getOwnPropertyDescriptors(Path))) {
      if (key === "length") continue; // constructor function arity
      if (key === "name") continue; // constructor function name
      if (key === "toString") continue; // this method is overwritten for bytecode reasons
      if (key === "prototype") continue; // checked below

      const value = Path[key];
      const hasHelpText = help.getHelpText(value) !== null;
      console.log((hasHelpText ? "[x]" : "[ ]") + " Path." + key + ":", typeof value);
    }

    for (const key of Object.keys(Object.getOwnPropertyDescriptors(Path.prototype))) {
      const value = Path.prototype[key];
      const hasHelpText = help.getHelpText(value) !== null;
      console.log((hasHelpText ? "[x]" : "[ ]") + " Path.prototype." + key + ":", typeof value);
    }
  `);
  expect(cleanResult(result)).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "
    [x] Path.splitToSegments: function
    [x] Path.detectSeparator: function
    [x] Path.normalize: function
    [ ] Path.isAbsolute: function
    [x] Path.fromRaw: function
    [x] Path.OS_SEGMENT_SEPARATOR: string
    [x] Path.OS_ENV_VAR_SEPARATOR: string
    [x] Path.OS_PROGRAM_EXTENSIONS: object
    [x] Path.prototype.constructor: function
    [ ] Path.prototype.normalize: function
    [ ] Path.prototype.concat: function
    [ ] Path.prototype.isAbsolute: function
    [ ] Path.prototype.clone: function
    [ ] Path.prototype.relativeTo: function
    [ ] Path.prototype.toString: function
    [ ] Path.prototype.toJSON: function
    [ ] Path.prototype.basename: function
    [ ] Path.prototype.extname: function
    [ ] Path.prototype.dirname: function
    [ ] Path.prototype.startsWith: function
    [ ] Path.prototype.endsWith: function
    [ ] Path.prototype.indexOf: function
    [ ] Path.prototype.includes: function
    [ ] Path.prototype.replace: function
    [ ] Path.prototype.replaceAll: function
    [ ] Path.prototype.replaceLast: function
    ",
    }
  `);
});
