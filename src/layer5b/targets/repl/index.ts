import * as std from "quickjs:std";

export default function replTarget(
  lang:
    | "js"
    | "javascript"
    | "ts"
    | "typescript"
    | "jsx"
    | "tsx"
    | "coffee"
    | "coffeescript"
    | "civet"
    | undefined,
) {
  std.out.setvbuf(std._IONBF, std.BUFSIZ);
  startRepl({}, lang);
}
