import child_process from "child_process";

function run(cmd: string) {
  return child_process.execSync(cmd, { encoding: "utf-8" }).trim();
}

function getVersion(): string {
  let dirty = "";
  try {
    run("git diff --quiet . ':!bin'");
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

module.exports = getVersion();
