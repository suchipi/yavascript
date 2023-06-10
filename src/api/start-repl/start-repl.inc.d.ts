/**
 * Launch the Yavascript REPL (read-eval-print-loop).
 *
 * @param context Variables to make available as globals within the repl.
 * @param lang The langauge to use in the repl. Defaults to "javascript".
 */
declare function startRepl(
  context?: { [key: string]: any },
  lang?:
    | "js"
    | "javascript"
    | "ts"
    | "typescript"
    | "jsx"
    | "tsx"
    | "coffee"
    | "coffeescript"
): void;
