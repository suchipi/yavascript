import fs from "fs";
import child_process from "child_process";
import stripAnsi from "strip-ansi";
import { pathMarker } from "path-less-traveled";
import print from "@suchipi/print";
import { spawn, Options as SpawnOptions } from "first-base";
import * as inspectOptions from "../../../src/inspect-options";
import * as npmLib from "../../npm/lib";
import rootDir from "../../root-dir";

export const TMP = child_process
  .execSync("realpath /tmp", { encoding: "utf-8" })
  .trim();

export { rootDir };

const npmBinDir = pathMarker(rootDir("meta/npm/bin"));

function getBinaryPath(platform: string, arch: string) {
  const buildQuickResult = rootDir("dist", "yavascript");
  if (fs.existsSync(buildQuickResult)) {
    return buildQuickResult;
  }

  const npmBinPath = npmLib.getBinaryPath(platform + "-" + arch);
  return rootDir("bin", npmBinDir.relative(npmBinPath));
}

const binaryPath = getBinaryPath(process.platform, process.arch);

export { binaryPath, getBinaryPath };

export type EvaluateResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  error: boolean;
};

export async function runYavascript(
  args: Array<string>,
  options: SpawnOptions = {}
) {
  const runContext = spawn(binaryPath, args, {
    cwd: rootDir(),
    ...options,
  });
  await runContext.completion;
  return runContext.result;
}

export async function evaluate(
  code: string,
  options: SpawnOptions = {}
): Promise<EvaluateResult> {
  return runYavascript(["-e", code], options);
}

export function inspect(value: any): string {
  // options to inspect here match what is given to console.log
  return print(value, inspectOptions.forPrint());
}

export function cleanOutput(input: string): string {
  return stripAnsi(input)
    .split("\n")
    .map((line) => {
      if (/  at ([A-Za-z0-9\-_$<>]+)/g.test(line)) {
        return "  at somewhere";
      } else if (line.startsWith("  httpResponseHeaders:")) {
        return "  httpResponseHeaders: <redacted>";
      } else if (line.startsWith("  httpResponseBody:")) {
        return "  httpResponseBody: <redacted>";
      } else {
        return line;
      }
    })
    .join("\n")
    .replace(/(  at somewhere\n)+/g, "  at somewhere\n")
    .replace(new RegExp(TMP, "g"), "/tmp")
    .replace(new RegExp(binaryPath, "g"), "<yavascript binary>")
    .replace(new RegExp(rootDir(), "g"), "<rootDir>")
    .replace(new RegExp(/pid: \d+/, "g"), "pid: <redacted>")
    .replace(new RegExp(/oldPid: \d+/, "g"), "oldPid: <redacted>");
}

export function cleanResult(input: EvaluateResult): EvaluateResult {
  return {
    ...input,
    stdout: cleanOutput(input.stdout),
    stderr: cleanOutput(input.stderr),
  };
}
