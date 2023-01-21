import fs from "fs";
import path from "path";
import { spawn } from "first-base";
import { binaryPath, cleanResult } from "./test-helpers";

const scriptsDir = path.resolve(__dirname, "test_fixtures", "scripts");

const scripts = fs.readdirSync(scriptsDir);
for (const script of scripts) {
  test(script, async () => {
    const run = spawn(binaryPath, [script], { cwd: scriptsDir });
    await run.completion;
    expect(cleanResult(run.result)).toMatchSnapshot();
  });
}
