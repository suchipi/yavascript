import * as std from "quickjs:std";
import { toArgv } from "./to-argv";
import { env } from "../env";
import { traceAll } from "../trace-all";
import { assert } from "../assert";
import type { Path } from "../path";
import { setHelpText } from "../help";
import execHelpText from "./exec.help.md";
import dollarHelpText from "./_dollar.help.md";
import { ChildProcess } from "./ChildProcess";
import { types } from "../types";
import { ExecResult } from "./ExecResult";

const exec = (
  args: Array<string | Path | number> | string | Path,
  options: {
    cwd?: string | Path;
    env?: { [key: string | number]: string | number | boolean };
    captureOutput?: boolean | "utf8" | "arraybuffer";
    trace?: (...args: Array<any>) => void;
  } = {}
): ExecResult<any, false> => {
  // 'args' type gets checked in ChildProcess constructor
  assert.type(
    options,
    types.object,
    "'options' argument must be either an object or undefined"
  );

  const {
    captureOutput = false,
    cwd,
    env,
    trace = traceAll.getDefaultTrace(),
  } = options;

  assert.type(
    captureOutput,
    types.or(
      types.boolean,
      types.exactString("utf8"),
      types.exactString("arraybuffer")
    ),
    "when present, 'captureOutput' option must be either a boolean or one of the strings 'utf8' or 'arraybuffer'"
  );

  if (trace != null) {
    assert.type(
      trace,
      types.Function,
      "when present, 'options.trace' must be a function"
    );
  }

  const child = new ChildProcess(args, { cwd, env, trace });

  let tmpOut: FILE | null = null;
  let tmpErr: FILE | null = null;
  if (captureOutput) {
    // these tmpfiles get closed by their GC finalizer
    tmpOut = std.tmpfile();
    child.stdio.out = tmpOut;
    tmpErr = std.tmpfile();
    child.stdio.err = tmpErr;
  }

  try {
    child.start();

    return new ExecResult({
      child,
      stdioType: captureOutput === true ? "utf8" : captureOutput || null,
      trace,
    });
  } catch (err) {
    if (trace) {
      trace("exec error:", err);
    }
    throw err;
  }
};

setHelpText(exec, execHelpText);

export { exec };

export function $(
  args: Array<string | Path | number> | string | Path
): ExecResult<string, true> {
  return exec(args as any, {
    captureOutput: true,
  })
    .wait()
    .assertExitStatusZero();
}

exec.toArgv = toArgv;

setHelpText($, dollarHelpText);
