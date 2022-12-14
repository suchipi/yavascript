/**
 * Parse command line --flags into an object of flags and an array of
 * positional arguments. This function is opinionated; if it doesn't meet your
 * needs, you can parse the `scriptArgs` global manually.
 *
 * Flags `--like-this`, `--like_this`, or `--LIKE_THIS` get converted into
 * property names `likeThis` on the returned flags object.
 *
 * Flags like this: `-v` get converted into into property names like this: `v`
 * on the returned flags object.
 *
 * Anything that appears after `--` is considered a positional argument instead
 * of a flag. `--` is not present in the returned positional arguments Array.
 *
 * Single-character flags must have a single leading dash, and multi-character
 * flags must have two leading dashes.
 *
 * Flags with equals signs in them (eg. `--something=42`) are not supported.
 * Write `--something 42` instead.
 *
 * Flags where you specify them multiple times, like `-vvv`, are not supported.
 * Write something like `-v 3` instead.
 *
 * @param hints - An object whose keys are flag names (in camelCase) and whose values indicate what type to treat that flag as. Valid property values are `String`, `Boolean`, `Number`, and `parseScriptArgs.Path`. `parseScriptArgs.Path` will resolve relative paths into absolute paths for you. If no hints object is specified, `parseScriptArgs` will do its best to guess, based on the command-line args.
 * @param argv - An array containing the command line flags you want to parse. If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to skip the yavascript binary and script name). If you pass in an array here, it should only contain command-line flags, not the binary being called.
 *
 * @returns An object with two properties: `flags` and `args`. `flags` is an object whose keys are camelCase flag names and whose values are strings, booleans, or numbers corresponding to the input command-line args. `args` is an Array of positional arguments, as found on the command-line.
 */
declare const parseScriptArgs: {
  /**
   * Parse command line --flags into an object of flags and an array of
   * positional arguments. This function is opinionated; if it doesn't meet your
   * needs, you can parse the `scriptArgs` global manually.
   *
   * Flags `--like-this`, `--like_this`, or `--LIKE_THIS` get converted into
   * property names `likeThis` on the returned flags object.
   *
   * Flags like this: `-v` get converted into into property names like this: `v`
   * on the returned flags object.
   *
   * Anything that appears after `--` is considered a positional argument instead
   * of a flag. `--` is not present in the returned positional arguments Array.
   *
   * Single-character flags must have a single leading dash, and multi-character
   * flags must have two leading dashes.
   *
   * Flags with equals signs in them (eg. `--something=42`) are not supported.
   * Write `--something 42` instead.
   *
   * Flags where you specify them multiple times, like `-vvv`, are not supported.
   * Write something like `-v 3` instead.
   *
   * @param hints - An object whose keys are flag names (in camelCase) and whose values indicate what type to treat that flag as. Valid property values are `String`, `Boolean`, `Number`, and `parseScriptArgs.Path`. `parseScriptArgs.Path` will resolve relative paths into absolute paths for you. If no hints object is specified, `parseScriptArgs` will do its best to guess, based on the command-line args.
   * @param args - An array containing the command line flags you want to parse. If unspecified, `scriptArgs.slice(2)` will be used (we slice 2 in order to skip the yavascript binary and script name). If you pass in an array here, it should only contain command-line flags, not the binary being called.
   *
   * @returns An object with two properties: `flags` and `args`. `flags` is an object whose keys are camelCase flag names and whose values are strings, booleans, or numbers corresponding to the input command-line args. `args` is an Array of positional arguments, as found on the command-line.
   */
  (
    hints?: {
      [key: string]:
        | typeof String
        | typeof Boolean
        | typeof Number
        | typeof parseScriptArgs["Path"];
    },
    args?: Array<string>
  ): {
    flags: { [key: string]: any };
    args: Array<string>;
  };

  /**
   * A hint value for {@link parseScriptArgs}. Behaves similar to the hint value
   * `String`, except that it also resolves relative paths into absolute paths,
   * using the following rules:
   *
   * - paths `./like/this` or `../like/this` get resolved relative to `pwd()`.
   * - paths `like/this` or `this` get resolved relative to `pwd()` as if they had a leading `./`.
   */
  readonly Path: unique symbol;
};
