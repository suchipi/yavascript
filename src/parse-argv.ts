import * as std from "std";
import { LANGS } from "./langs";

export default function parseArgv(argv: Array<string>): {
  flags: {
    help?: true;
    version?: true;
    license?: true;
    printTypes?: true;
    printSrc?: true;
    eval?: string | null;
    lang?: string | null;
  };
  positionalArgs: Array<string>;
} {
  const flags: { [key: string]: any } = {};
  const positionalArgs: Array<string> = [];

  let hasSeenDoubleDash = false;

  // i starts at 1 to skip argv[0] which will always be the yavascript binary
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    const nextArg = argv[i + 1] || null;

    if (arg === "--") {
      hasSeenDoubleDash = true;
      continue;
    }

    if (hasSeenDoubleDash) {
      positionalArgs.push(arg);
    } else {
      if (arg === "-h" || arg === "--help") {
        flags.help = true;
      } else if (arg === "-v" || arg === "--version" || arg === "-version") {
        flags.version = true;
      } else if (arg === "--license") {
        flags.license = true;
      } else if (arg === "--print-types") {
        flags.printTypes = true;
      } else if (arg === "--print-src") {
        flags.printSrc = true;
      } else if (arg === "-e" || arg === "--eval") {
        flags.eval = nextArg;
        i++;
      } else if (arg === "--lang") {
        if (!nextArg || !LANGS.has(nextArg)) {
          const validLangs = Array.from(LANGS);
          std.err.puts(
            `Invalid --lang: ${JSON.stringify(
              nextArg
            )}.\nValid values for --lang are ${validLangs
              .slice(0, -1)
              .join(", ")} or ${validLangs[validLangs.length - 1]}.\n`
          );
          std.exit(1);
        }

        flags.lang = nextArg;
        i++;
      } else {
        positionalArgs.push(arg);
      }
    }
  }

  return { flags, positionalArgs };
}
