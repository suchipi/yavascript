import { spawn, Options as SpawnOptions } from "first-base";
import path from "path";

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

export async function evaluate(code: string, options: SpawnOptions = {}) {
  const runContext = spawn(binaryPath, ["-e", code], options);
  await runContext.completion;
  return runContext.result;
}
