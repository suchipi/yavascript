import { LANGS } from "./langs";

type TargetInfo<Name extends String, Rest = {}> = { target: Name } & Rest;

export type TargetDetermination =
  | TargetInfo<"help">
  | TargetInfo<"version">
  | TargetInfo<"license">
  | TargetInfo<"print-types">
  | TargetInfo<"repl", { lang: string | null }>
  | TargetInfo<"eval", { code: string; lang: string | null }>
  | TargetInfo<"run-file", { file: string; lang: string | null }>
  | TargetInfo<"invalid", { message: string }>;

export default function determineTarget(
  argv: Array<string>
): TargetDetermination {
  const [_yavascriptBinary, ...rest] = argv;

  if (rest.length === 0) {
    // They ran the program with no args
    return { target: "repl", lang: null };
  }

  const arg1 = rest[0];
  if (rest.length === 1) {
    // Note that these flags *only* function when there are no other arguments.
    // This is done to minimize collisions between flags for user programs and
    // flags for yavascript itself. Namely, if a user wants to implement custom
    // behavior in their own CLI tool for '-h' or '-v', they should be able to
    // do so. In order to guarantee that, we must *NOT* run *our* behavior for
    // those flags unless we are certain we aren't about to execute a user
    // program.
    switch (arg1) {
      case "-h":
      case "--help": {
        return { target: "help" };
      }
      case "-v":
      case "--version":
      case "-version": {
        return { target: "version" };
      }
      case "--license": {
        return { target: "license" };
      }
      case "--print-types": {
        return { target: "print-types" };
      }

      case "-e":
      case "--eval": {
        return {
          target: "invalid",
          message: `Please specify the code string to run. For example: yavascript -e 'echo("hi")'`,
        };
      }

      case "--lang": {
        return {
          target: "invalid",
          message: "--lang requires an argument: The language to use.",
        };
      }

      case "--": {
        // Act as if they ran the program with no args
        return { target: "repl", lang: null };
      }

      default: {
        return { target: "run-file", file: arg1, lang: null };
      }
    }
  }

  const info = {
    file: null as string | null,
    eval: null as string | null,
    lang: null as string | null,
  };

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    const nextArg = rest[i + 1] || null;

    if (arg === "--") {
      break;
    }

    if (arg === "-e" || arg === "--eval") {
      if (nextArg == null) {
        return {
          target: "invalid",
          message: `${arg} requires an argument: The code to eval.`,
        };
      }
      info.eval = nextArg;
      i++;
    } else if (arg === "--lang") {
      if (nextArg == null) {
        return {
          target: "invalid",
          message: "--lang requires an argument: The language to use.",
        };
      }

      if (!LANGS.has(nextArg)) {
        const validLangs = Array.from(LANGS);
        return {
          target: "invalid",
          message: `Invalid --lang: ${JSON.stringify(
            nextArg
          )}.\nValid values for --lang are ${validLangs
            .slice(0, -1)
            .join(", ")} or ${validLangs[validLangs.length - 1]}.\n`,
        };
      }

      info.lang = nextArg;
      i++;
    } else if (info.eval == null && info.file == null) {
      info.file = arg;
    }
  }

  if (info.eval != null) {
    return { target: "eval", code: info.eval, lang: info.lang };
  } else if (info.file != null) {
    return { target: "run-file", file: info.file, lang: info.lang };
  } else {
    return { target: "repl", lang: info.lang };
  }
}
