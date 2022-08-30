import * as std from "std";
import * as pkg from "../../package.json";
import readme from "../../README.md";

export default function helpTarget() {
  std.err.puts(`yavascript ${pkg.version}

Usage: One of these:
  yavascript
  yavascript <path/to/file-to-run.js>
  yavascript -e '<code-to-run>'
  yavascript --eval '<code-to-run>'
  yavascript -v
  yavascript --version
  yavascript --license

${readme.split("\n").slice(4).join("\n")}`);
  std.exit(2);
}
