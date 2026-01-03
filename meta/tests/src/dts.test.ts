import fs from "fs";
import ts from "typescript";
import { rootDir } from "./test-helpers";

const dtsPath = rootDir("yavascript.d.ts");

describe("yavascript.d.ts", () => {
  it("is considered a global script rather than a module", async () => {
    const content = await fs.promises.readFile(dtsPath, "utf-8");
    const sourceFile = ts.createSourceFile(
      "yavascript.d.ts",
      content,
      ts.ScriptTarget.ES2020,
    );

    // @ts-ignore this function is there, but it isn't in the type defs
    const isModule = ts.isFileProbablyExternalModule(sourceFile);

    // Could just do `expect(isModule).toBeFalsy()`, but all the stuff below
    // will give a more actionable error message
    if (!isModule) {
      return;
    }

    const lines = content.split("\n");
    const exportingLineIndex = lines.findIndex((line) =>
      line.startsWith("export"),
    );
    const exportingLine =
      exportingLineIndex === -1 ? null : lines[exportingLineIndex];
    if (exportingLine != null) {
      const lineNumber = exportingLineIndex + 1;
      const actual = `Line ${lineNumber}: ${exportingLine}`;
      const expected = `Line ${lineNumber}: ${exportingLine.replace(
        /^export/,
        "declare",
      )}`;
      expect(actual).toBe(expected);
    } else {
      // We can't give a very actionable error message, but this test needs to
      // still fail.
      expect(isModule).toBeFalsy();
    }
  });
});
