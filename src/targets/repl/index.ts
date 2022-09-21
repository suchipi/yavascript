export default function replTarget(lang: string) {
  require("./modified-qjs-repl").startRepl(lang);
}
