import { hasColors } from "../../has-colors";
import { blue, underline } from "../strings";
import { yavascript } from "../yavascript";

const docsUrlForRef = (ref: string) => {
  return `https://github.com/suchipi/yavascript/blob/${ref}/meta/generated-docs/README.md`;
};

export function help() {
  let url;

  const ver = yavascript.version;

  let matches: RegExpMatchArray | null = null;
  if ((matches = ver.match(/^git-([A-Fa-f0-9]+)(?:-dirty)$/))) {
    const sha = matches[1];
    url = docsUrlForRef(sha);
  } else if ((matches = ver.match(/^(v[0-9.]+)/))) {
    const version = matches[1];
    url = docsUrlForRef(version);
  } else {
    // idk
    url = docsUrlForRef("main");
  }

  if (hasColors()) {
    url = underline(blue(url));
  }
  console.log("\nPlease see: " + url + "\n");
}
