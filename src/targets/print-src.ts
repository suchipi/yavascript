import * as std from "std";
import * as os from "os";

export default function printSrcTarget() {
  const qjsbootstrap_offset = globalThis.__qjsbootstrap_offset;
  if (qjsbootstrap_offset == null) {
    throw new Error(
      "Was not able to find the offset where qjsbootstrap ends and yavascript begins"
    );
  }

  const yavascriptBin = std.open(os.execPath(), "r");
  yavascriptBin.seek(qjsbootstrap_offset, std.SEEK_SET);
  const yavascriptSrc = yavascriptBin.readAsString();
  std.out.puts(yavascriptSrc);
}
