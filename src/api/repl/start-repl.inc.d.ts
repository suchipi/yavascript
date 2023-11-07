/**
 * Launch the Yavascript REPL (read-eval-print-loop).
 *
 * @param context Variables to make available as globals within the repl.
 * @param lang The langauge to use in the repl. Defaults to "javascript".
 */
declare const startRepl: {
  (
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
      | "civet"
  ): void;

  /**
   * A special value; when expressions result in this value, the repl will
   * print nothing instead of printing this value.
   */
  NOTHING: symbol;
};
