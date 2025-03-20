const child_process = require("child_process");

function run(cmd) {
  return child_process.execSync(cmd, { encoding: "utf-8" }).trim();
}

// If you change the version string format, update help.ts and
// yavascript.inc.d.ts
function getVersion() {
  if (process.env.YAVASCRIPT_VERSION) {
    if (!process.env.YAVASCRIPT_VERSION.startsWith("v")) {
      throw new Error(`env var YAVASCRIPT_VERSION must start with 'v'!`);
    }
    return process.env.YAVASCRIPT_VERSION;
  }

  let dirty = "";
  try {
    run("git diff --quiet .");
  } catch (err) {
    dirty = "-dirty";
  }

  try {
    const gitTags = run("git tag --points-at HEAD")
      .split(/\s+/g)
      .filter(Boolean);

    if (gitTags.length > 0) {
      return gitTags[0] + dirty;
    }
  } catch (err) {
    // ignored
  }

  try {
    const SHA = run("git rev-parse HEAD");
    return "git-" + SHA.slice(0, 12) + dirty;
  } catch (err) {
    // ignored
  }

  return "unknown";
}

function getArch() {
  if (process.env.YAVASCRIPT_ARCH) {
    return process.env.YAVASCRIPT_ARCH;
  }

  try {
    return run("uname -m");
  } catch (err) {
    return "unknown";
  }
}

module.exports = {
  version: getVersion(),
  arch: getArch(),
};

const wellKnownArchitectures = new Set(["arm64", "x86_64"]);

if (!wellKnownArchitectures.has(module.exports.arch)) {
  console.warn(
    `WARNING: yavascript.arch will be set to '${module.exports.arch}', which may not be desirable. Generally, it should be either 'arm64' or 'x86_64'. Feel free to ignore this message if compiling for a different architecture.`
  );
}
