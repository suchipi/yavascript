import * as clefParse from "clef-parse";
import { paths } from "./paths";
import { pwd } from "./commands/pwd";

function parseScriptArgs(
  hints: { [key: string]: clefParse.Hint } = {},
  args: Array<string> = scriptArgs.slice(2)
): {
  flags: { [key: string]: any };
  args: Array<string>;
} {
  // clef-parse calls `shift` on this
  const argsClone = args.slice();

  const { options, positionalArgs } = clefParse.parseArgv(argsClone, hints, {
    isAbsolute: paths.isAbsolute,
    resolvePath: paths.resolve,
    getCwd: pwd,
  });
  return {
    flags: options,
    args: positionalArgs,
  };
}

export default Object.assign(parseScriptArgs, { Path: clefParse.Path });
