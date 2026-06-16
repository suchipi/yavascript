/// <reference types="@suchipi/shinobi/globals.d.ts" />
/// <reference types="node" />

import { layer5a_arm64_js, layer5a_x86_64_js } from "./layer5a.ninja.ts";

function program(
  programName: string,
  target: string,
  base: string,
  input: string,
) {
  build({
    rule: "make-program",
    inputs: [input],
    ruleVariables: {
      TARGET: target,
      BASE: base,
    },
    output: builddir(
      `bin/${target}/${programName}${base.endsWith(".exe") ? ".exe" : ""}`,
    ),
  });
}

program(
  "yavascript-bootstrap",
  "x86_64-apple-darwin",
  "qjsbootstrap",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-static",
  "qjsbootstrap",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-gnu",
  "qjsbootstrap",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-linux-musl",
  "qjsbootstrap",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-unknown-freebsd-15",
  "qjsbootstrap",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "x86_64-pc-windows-static",
  "qjsbootstrap.exe",
  layer5a_x86_64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-apple-darwin",
  "qjsbootstrap",
  layer5a_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-static",
  "qjsbootstrap",
  layer5a_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-gnu",
  "qjsbootstrap",
  layer5a_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-linux-musl",
  "qjsbootstrap",
  layer5a_arm64_js,
);
program(
  "yavascript-bootstrap",
  "aarch64-unknown-freebsd-15",
  "qjsbootstrap",
  layer5a_arm64_js,
);

const qjsPlatform = require("@suchipi/quickjs").identifyCurrentPlatform();
build({
  rule: "copy",
  inputs: [
    builddir(
      `bin/${qjsPlatform.name}/yavascript-bootstrap${qjsPlatform.programSuffix}`,
    ),
  ],
  output: builddir("yavascript-bootstrap" + qjsPlatform.programSuffix),
});
