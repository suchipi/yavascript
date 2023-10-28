/**
 * Exit the yavascript process.
 *
 * Provides the same functionality as the shell builtin of the same name.
 *
 * If exit is called with an argument, that argument is used as the exit code.
 * Otherwise, `exit.code` is used, which defaults to 0.
 *
 * `exit.code` will also be used as the exit status code for the yavascript
 * process if the process exits normally.
 */
declare const exit: {
  (code?: number): never;
  code: number;
};
