import { describe, expect, it } from "vitest";
import fs from "fs";
import { API } from "typescript/unstable/async";
import { rootDir } from "./test-helpers";

const dtsPath = rootDir("yavascript.d.ts");

describe("yavascript.d.ts", () => {
  it("is considered a global script rather than a module", async () => {
    const api = new API();
    let isModule: boolean;
    try {
      const snapshot = await api.updateSnapshot({ openFiles: [dtsPath] });
      const project = await snapshot.getDefaultProjectForFile(dtsPath);
      if (project == null) {
        throw new Error(`Couldn't load a project for ${dtsPath}`);
      }
      const sourceFile = await project.program.getSourceFile(dtsPath);
      if (sourceFile == null) {
        throw new Error(`Couldn't parse ${dtsPath}`);
      }

      isModule = sourceFile.externalModuleIndicator != null;
    } finally {
      await api.close();
    }

    // Could just do `expect(isModule).toBeFalsy()`, but all the stuff below
    // will give a more actionable error message
    if (!isModule) {
      return;
    }

    const content = await fs.promises.readFile(dtsPath, "utf-8");
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
