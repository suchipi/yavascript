import { spawn, Options as SpawnOptions } from "first-base";
import child_process from "child_process";
import path from "path";
import print from "@suchipi/print";
import stripAnsi from "strip-ansi";
import { pathMarker } from "path-less-traveled";
import * as inspectOptions from "./inspect-options";

export const TMP = child_process
  .execSync("realpath /tmp", { encoding: "utf-8" })
  .trim();

export const rootDir = pathMarker(path.resolve(__dirname, ".."));

function getBinaryPath(platform: string, arch: string) {
  if (platform === "win32") {
    return rootDir("bin/windows/yavascript.exe");
  } else if (platform === "darwin") {
    if (arch.startsWith("arm")) {
      return rootDir("bin/darwin-arm/yavascript");
    } else {
      return rootDir("bin/darwin/yavascript");
    }
  } else if (platform === "linux") {
    return rootDir("bin/linux/yavascript");
  } else {
    throw new Error("Unsupported platform: " + platform);
  }
}

const binaryPath = getBinaryPath(
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
  const cleanStr = input
    .replace(/yavascript:\d+/g, "yavascript")
    .replace(/\/bin\/[^/]+\/yavascript/g, "/bin/.../yavascript")
    .replace(new RegExp(TMP, "g"), "/tmp")
    .replace(new RegExp(rootDir(), "g"), "<rootDir>");
  return stripAnsi(cleanStr);
}

export function cleanResult(input: EvaluateResult): EvaluateResult {
  return {
    ...input,
    stdout: cleanOutput(input.stdout),
    stderr: cleanOutput(input.stderr),
  };
}
