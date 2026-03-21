import * as std from "quickjs:std";

export default function replTarget(lang: string) {
  std.out.setvbuf(std._IONBF, std.BUFSIZ);
  require("../../api/repl/modified-qjs-repl").startRepl(lang);
}
