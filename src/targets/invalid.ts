import * as std from "quickjs:std";

export default function invalidTarget(message: string) {
  std.err.puts(message + "\n");
  std.err.puts(`For more info, run '${scriptArgs[0]} --help'.\n`);
}
