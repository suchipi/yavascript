let dtsText: string | null = null;
export function getDtsText() {
  if (dtsText != null) {
    return dtsText;
  }

  const {
    decompress,
  }: typeof import("./lz-string-decompress") = require("./lz-string-decompress");

  const dtsCompressed = require("../../dist/yavascript.d.ts?lzStringCompressed");
  dtsText = decompress(dtsCompressed);
  return dtsText;
}
