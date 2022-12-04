import { spawn, Options as SpawnOptions } from "first-base";
import child_process from "child_process";
import path from "path";
import print from "@suchipi/print";
import * as inspectOptions from "./inspect-options";

export const TMP = child_process
  .execSync("realpath /tmp", { encoding: "utf-8" })
  .trim();

export const rootDir = (...parts: Array<string>) =>
  path.resolve(__dirname, "..", ...parts);

function getBinaryPath(platform: string, arch: string) {
  if (platform === "win32") {
    return path.resolve(__dirname, "..", "bin", "windows", "yavascript.exe");
  } else if (platform === "darwin") {
    if (arch.startsWith("arm")) {
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

var binaryPath = getBinaryPath(
  process.platform,
  process.env.YS_TESTS_ARCH || process.arch
);

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
  return print(value, inspectOptions.forPrint);
}

export function cleanOutput(input: string): string {
  return input
    .replace(/yavascript:\d+/g, "yavascript")
    .replace(/\/bin\/[^/]+\/yavascript/g, "/bin/.../yavascript")
    .replace(new RegExp(rootDir(), "g"), "<rootDir>");
}

export function cleanResult(input: EvaluateResult): EvaluateResult {
  return {
    ...input,
    stdout: cleanOutput(input.stdout),
    stderr: cleanOutput(input.stderr),
  };
}
