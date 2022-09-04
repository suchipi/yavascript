import { spawn, Options as SpawnOptions } from "first-base";
import path from "path";
import print from "@suchipi/print";
import inspectOptionsForPrint from "./inspect-options-for-print";

const rootDir = path.resolve(__dirname, "..");

function getBinaryPath(platform: string) {
  if (platform === "win32") {
    return path.resolve(__dirname, "..", "bin", "windows", "yavascript.exe");
  } else if (platform === "darwin") {
    if (process.arch.startsWith("arm")) {
      return path.resolve(__dirname, "..", "bin", "darwin-arm", "yavascript");
    } else {
      return path.resolve(__dirname, "..", "bin", "darwin", "yavascript");
    }
  } else if (platform === "linux") {
    return path.resolve(__dirname, "..", "bin", "linux", "yavascript");
  } else {
    throw new Error("Unsupported platform: " + platform);
  }
}

var binaryPath = getBinaryPath(process.platform);

export { binaryPath, getBinaryPath };

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

export function cleanOutput(input: string): string {
  return input
    .replace(/yavascript-internal\.js:\d+/g, "yavascript-internal.js")
    .replace(new RegExp(rootDir, "g"), "<rootDir>");
}

export function cleanResult(input: EvaluateResult): EvaluateResult {
  return {
    ...input,
    stdout: cleanOutput(input.stdout),
    stderr: cleanOutput(input.stderr),
  };
}
