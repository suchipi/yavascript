import { spawn, Options as SpawnOptions } from "first-base";
import path from "path";
import print from "@suchipi/print";
import inspectOptionsForPrint from "./inspect-options-for-print";

var binaryPath: string;
if (process.platform === "win32") {
  binaryPath = path.resolve(
    __dirname,
    "..",
    "bin",
    "windows",
    "yavascript.exe"
  );
} else if (process.platform === "darwin") {
  if (process.arch.startsWith("arm")) {
    binaryPath = path.resolve(
      __dirname,
      "..",
      "bin",
      "darwin-arm",
      "yavascript"
    );
  } else {
    binaryPath = path.resolve(__dirname, "..", "bin", "darwin", "yavascript");
  }
} else if (process.platform === "linux") {
  binaryPath = path.resolve(__dirname, "..", "bin", "linux", "yavascript");
} else {
  throw new Error("Unsupported platform: " + process.platform);
}

export { binaryPath };

export type EvaluateResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  error: boolean;
};

export async function evaluate(
  code: string,
  options: SpawnOptions = {}
): Promise<EvaluateResult> {
  const runContext = spawn(binaryPath, ["-e", code], options);
  await runContext.completion;
  return runContext.result;
}

export function inspect(value: any): string {
  // options to inspect here match what is given to console.log
  return print(value, inspectOptionsForPrint);
}

export function cleanStack(input: string): string {
  return input.replace(
    /yavascript-internal\.js:\d+/g,
    "yavascript-internal.js"
  );
}

export function cleanResult(input: EvaluateResult): EvaluateResult {
  return {
    ...input,
    stdout: cleanStack(input.stdout),
    stderr: cleanStack(input.stderr),
  };
}
