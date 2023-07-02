export default function replTarget(lang: string) {
  require("../../api/repl/modified-qjs-repl").startRepl(lang);
}
