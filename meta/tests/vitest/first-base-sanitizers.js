const fs = require("fs");
const child_process = require("child_process");
const { sanitizers } = require("first-base");
const { pathMarker } = require("path-less-traveled");
const stripAnsi = require("strip-ansi");
const npmLib = require("../../npm/lib");
const rootDir = require("../../root-dir");

const npmBinDir = pathMarker(rootDir("meta/npm/bin"));

function getBinaryPath(platform, arch) {
  const buildQuickResult = rootDir("dist", "yavascript");
  if (fs.existsSync(buildQuickResult)) {
    return buildQuickResult;
  }

  const npmBinPath = npmLib.getBinaryPath(platform + "-" + arch);
  return rootDir("bin", npmBinDir.relative(npmBinPath));
}

const binaryPath = getBinaryPath(process.platform, process.arch);

const ansiSequenceRegexp = "(?:\\x1b\\[[\\d;]*m)*";

sanitizers.push(function redactLineAndColumnNumbers(str) {
  // Colored output puts escape sequences around the property name, its colon
  // and its value, so they have to be allowed for anywhere in between.
  return str.replace(
    new RegExp(
      `((?:line|column)Number${ansiSequenceRegexp}:${ansiSequenceRegexp} ${ansiSequenceRegexp})\\d+`,
      "g",
    ),
    "$1<redacted>",
  );
});

const TMP = child_process
  .execSync("realpath /tmp", { encoding: "utf-8" })
  .trim();

sanitizers.push(function cleanOutput(input) {
  return stripAnsi(input)
    .replace(
      // quickjs C file line number augmented stack trace properties
      /(fileName: "<internal>[^\n]+\n\s*lineNumber): \d+/g,
      "$1: <redacted>",
    )
    .split("\n")
    .map((line) => {
      if (line.startsWith("  httpResponseHeaders:")) {
        return "  httpResponseHeaders: <redacted>";
      } else if (line.startsWith("  httpResponseBody:")) {
        return "  httpResponseBody: <redacted>";
      } else {
        return line;
      }
    })
    .join("\n")
    .replace(new RegExp(TMP, "g"), "/tmp")
    .replace(new RegExp(binaryPath, "g"), "<yavascript binary>")
    .replace(
      new RegExp(binaryPath.replace(rootDir(), "<rootDir>"), "g"),
      "<yavascript binary>",
    )
    .replace(/pid: \d+/g, "pid: <redacted>")
    .replace(/oldPid: \d+/g, "oldPid: <redacted>");
});
