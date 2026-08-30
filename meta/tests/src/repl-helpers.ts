import * as fs from "fs";
import { spawn, RunContext } from "first-base";
import { binaryPath, rootDir } from "./test-helpers";

/**
 * Bytes the repl's key table binds, by the name a person would use for the key.
 * See the `commands` table in src/layer1/api/repl/repl-engine.ts.
 */
export const KEYS = {
  ctrlA: "\x01",
  ctrlB: "\x02",
  ctrlC: "\x03",
  ctrlD: "\x04",
  ctrlE: "\x05",
  ctrlF: "\x06",
  ctrlG: "\x07",
  ctrlH: "\x08",
  tab: "\x09",
  ctrlJ: "\x0a",
  ctrlK: "\x0b",
  enter: "\x0d",
  ctrlN: "\x0e",
  ctrlP: "\x10",
  ctrlQ: "\x11",
  ctrlR: "\x12",
  ctrlS: "\x13",
  ctrlT: "\x14",
  ctrlW: "\x17",
  ctrlX: "\x18",
  ctrlY: "\x19",
  backspace: "\x7f",

  up: "\x1b[A",
  down: "\x1b[B",
  right: "\x1b[C",
  left: "\x1b[D",
  end: "\x1b[F",
  home: "\x1b[H",
  // SS3 (ESC O) is the "application mode" spelling of these keys, which
  // VT-style terminals send instead of the CSI (ESC [) one; see
  // https://en.wikipedia.org/wiki/ANSI_escape_code#Terminal_input_sequences
  ss3Up: "\x1bOA",
  ss3Down: "\x1bOB",
  ss3Right: "\x1bOC",
  ss3Left: "\x1bOD",
  ss3End: "\x1bOF",
  ss3Home: "\x1bOH",
  ctrlRight: "\x1b[1;5C",
  ctrlLeft: "\x1b[1;5D",
  homeTilde: "\x1b[1~",
  del: "\x1b[3~",
  endTilde: "\x1b[4~",
  pageUp: "\x1b[5~",
  pageDown: "\x1b[6~",

  altB: "\x1bb",
  altD: "\x1bd",
  altF: "\x1bf",
  altK: "\x1bk",
  altL: "\x1bl",
  altT: "\x1bt",
  altU: "\x1bu",
  altBackspace: "\x1b\x7f",
} as const;

/** The prompt printed in front of the first line of an expression. */
export const PROMPT = "> ";
/** The tail of the prompt printed in front of a continuation line. */
export const CONTINUATION_PROMPT = "... ";

export type ReplResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  error: Error | null;
};

export type ReplSessionOptions = {
  /**
   * Directory to use as the config dir, so history is written somewhere
   * disposable. When omitted, HOME/XDG_CONFIG_HOME/APPDATA are all left unset,
   * which makes getConfigDir() return null and disables HistoryFile entirely.
   */
  configDir?: string;
  /** Force colors on (CLICOLOR_FORCE=1) instead of off (CLICOLOR=0). */
  colors?: boolean;
  /** Extra environment variables, merged over the isolated base env. */
  env?: { [key: string]: string | undefined };
  /** How long waitFor/line will wait before failing with the output so far. */
  timeout?: number;
  /**
   * What counts as "the prompt" for the initial wait and for the default
   * `marker` of `input`/`line`. Defaults to the repl's `"> "`; an
   * InteractivePrompt with a custom prompt needs its own.
   */
  promptMarker?: string;
};

export type ReplSession = {
  /** The underlying first-base handle, for anything this wrapper doesn't cover. */
  run: RunContext;

  /** Write bytes to the repl's stdin without waiting for anything. */
  send(...chunks: string[]): void;

  /** Wait for `value` to show up in the output (ANSI stripped) since the last wait. */
  waitFor(value: string | RegExp): Promise<void>;

  /** Send bytes, then wait for `marker` (the next prompt by default). */
  input(
    chunks: string | Array<string>,
    marker?: string | RegExp,
  ): Promise<void>;

  /** Type `text`, press Enter, and wait for `marker` (the next prompt by default). */
  line(text: string, marker?: string | RegExp): Promise<void>;

  /** Press Ctrl-D on an empty line and wait for the process to exit. */
  exit(): Promise<void>;

  /** Wait for the process to exit (for tests that quit some other way). */
  finish(): Promise<void>;

  /** Sanitized output, with the repl's redraw artifacts normalized away. */
  result(): ReplResult;

  /** Untouched bytes, for assertions about escape sequences. */
  raw(): ReplResult;
};

/** The `\t` timing prompt, e.g. `0.001 > `, at the start of a line. */
const TIMING_PROMPT = /^\d\.\d{3} > /gm;

/**
 * The `\t` timing prompt reports real elapsed milliseconds, so it is replaced
 * with a fixed marker to keep snapshots from depending on how fast the machine
 * evaluated the previous line.
 */
function normalize(str: string): string {
  return str.replace(TIMING_PROMPT, "<time> > ");
}

function waitFor(
  run: RunContext,
  value: string | RegExp,
  timeoutMs: number,
): Promise<void> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `Timed out after ${timeoutMs}ms waiting for ${String(value)}.\n` +
            `stdout so far: ${JSON.stringify(run.result.stdout)}\n` +
            `stderr so far: ${JSON.stringify(run.result.stderr)}`,
        ),
      );
    }, timeoutMs);
  });

  return Promise.race([run.outputContains(value), timeout]).finally(() => {
    clearTimeout(timer);
  });
}

/**
 * Spawn the yavascript repl with an isolated environment and wait for its
 * first prompt.
 *
 * stdin is an ordinary pipe, not a pty: `termInit` only consults `os.isatty`
 * to decide whether to set raw mode and read the window size, so the whole key
 * table is still reachable, `term_width` is a fixed 80, and stdout and stderr
 * stay separate.
 */
export async function startReplSession(
  args: Array<string> = [],
  options: ReplSessionOptions = {},
): Promise<ReplSession> {
  const timeoutMs = options.timeout ?? 3000;
  const promptMarker = options.promptMarker ?? PROMPT;

  const env: { [key: string]: string | undefined } = {
    // spawn's `env` replaces the environment rather than extending it, so
    // HOME/XDG_CONFIG_HOME/APPDATA are absent unless configDir asks for them.
    PATH: process.env.PATH,
    [options.colors ? "CLICOLOR_FORCE" : "CLICOLOR"]: options.colors
      ? "1"
      : "0",
  };

  if (options.configDir != null) {
    fs.mkdirSync(options.configDir, { recursive: true });
    env.HOME = options.configDir;
    env.XDG_CONFIG_HOME = options.configDir;
    env.APPDATA = options.configDir;
  }

  Object.assign(env, options.env);

  const run = spawn(binaryPath, args, { cwd: rootDir(), env });

  const session: ReplSession = {
    run,

    send(...chunks) {
      run.write(chunks.join(""));
    },

    waitFor(value) {
      return waitFor(run, value, timeoutMs);
    },

    async input(chunks, marker = promptMarker) {
      // Clear before writing: output that arrives between the write and the
      // clear would otherwise be thrown away, and output from before it would
      // otherwise satisfy the wait immediately.
      run.clearOutputContainsBuffer();
      run.write(Array.isArray(chunks) ? chunks.join("") : chunks);
      await waitFor(run, marker, timeoutMs);
    },

    line(text, marker = promptMarker) {
      return session.input(text + KEYS.enter, marker);
    },

    async exit() {
      run.write(KEYS.ctrlD);
      await run.completion;
    },

    finish() {
      return run.completion;
    },

    result() {
      const cleaned = run.cleanResult();
      return {
        ...cleaned,
        stdout: normalize(cleaned.stdout),
        stderr: normalize(cleaned.stderr),
      };
    },

    raw() {
      return { ...run.result };
    },
  };

  await waitFor(run, promptMarker, timeoutMs);

  return session;
}

/**
 * Where the repl will put its history, given a config dir passed to
 * startReplSession. Mirrors getConfigDir() in src/layer1/config-dir.ts, which
 * picks a different subdirectory per platform.
 */
export function historyFilePath(
  configDir: string,
  filename = "yavascript_repl_history.txt",
): string {
  switch (process.platform) {
    case "win32":
      return `${configDir}/yavascript/${filename}`;
    case "darwin":
      return `${configDir}/Library/Application Support/yavascript/${filename}`;
    default:
      // XDG_CONFIG_HOME is set to configDir, and takes priority over HOME
      return `${configDir}/yavascript/${filename}`;
  }
}

/** A disposable config dir under the repo's gitignored .tmp/. */
export function tempConfigDir(name: string): string {
  const dir = rootDir(".tmp", "repl-tests", name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
