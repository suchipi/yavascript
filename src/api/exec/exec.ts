import * as std from "quickjs:std";
import { parseArgString } from "./parse-arg-string";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import { traceAll } from "../trace-all";
import { assert } from "../assert";
import type { Path } from "../path";
import { setHelpText } from "../help";
import execHelpText from "./exec.help.md";
import dollarHelpText from "./_dollar.help.md";
import { ChildProcess } from "./ChildProcess";

// TODO: 'raw' option for stdout/stderr when using captureOutput
const exec = (
  args: Array<string> | string,
  options: {
    cwd?: string | Path;
    env?: { [key: string | number]: string | number | boolean };
    failOnNonZeroStatus?: boolean;
    captureOutput?: boolean;
    trace?: (...args: Array<any>) => void;
  } = {}
): any => {
  // 'args' type gets checked in ChildProcess constructor
  assert.type(
    options,
    types.object,
    "'options' argument must be either an object or undefined"
  );

  const {
    failOnNonZeroStatus = true,
    captureOutput = false,
    cwd,
    env,
    trace = traceAll.getDefaultTrace(),
  } = options;

  assert.type(
    failOnNonZeroStatus,
    types.boolean,
    "when present, 'failOnNonZeroStatus' option must be a boolean"
  );
  assert.type(
    captureOutput,
    types.boolean,
    "when present, 'captureOutput' option must be a boolean"
  );

  if (trace != null) {
    assert.type(
      trace,
      types.Function,
      "when present, 'options.trace' must be a function"
    );
  }

  if (typeof args === "string") {
    args = parseArgString(args);
  }

  const child = new ChildProcess(args, { cwd, env, trace });

  let tmpOut: FILE | null = null;
  let tmpErr: FILE | null = null;
  if (captureOutput) {
    tmpOut = std.tmpfile();
    child.stdio.out = tmpOut;
    tmpErr = std.tmpfile();
    child.stdio.err = tmpErr;
  }

  let result: ReturnType<typeof child.waitUntilComplete> | null = null;
  try {
    child.start();
    result = child.waitUntilComplete();

    let stdout: string | null = null;
    let stderr: string | null = null;

    if (tmpOut != null && tmpErr != null) {
      // need to seek to beginning to read the data that was written
      tmpOut.seek(0, std.SEEK_SET);
      tmpErr.seek(0, std.SEEK_SET);
      stdout = tmpOut.readAsString();
      stderr = tmpErr.readAsString();
    }

    if (failOnNonZeroStatus && result.status !== 0) {
      const err = makeErrorWithProperties(
        `Command failed: ${JSON.stringify(args)}`,
        result
      );
      if (stdout != null) {
        err.stdout = stdout;
      }
      if (stderr != null) {
        err.stderr = stderr;
      }
      throw err;
    }

    if (!captureOutput) {
      if (failOnNonZeroStatus) {
        return undefined;
      } else {
        return result;
      }
    }

    if (stdout != null && stderr != null) {
      return { stdout, stderr, ...result };
    } else {
      throw new Error(
        "Internal error: tmpOut and tmpErr weren't set, but attempted to return stdout and stderr. This indicates a bug in the exec function"
      );
    }
  } catch (err) {
    if (trace) {
      trace("exec error:", err);
    }
    throw err;
  } finally {
    if (tmpOut != null) tmpOut.close();
    if (tmpErr != null) tmpErr.close();
  }
};

setHelpText(exec, execHelpText);

export { exec };

export function $(args: Array<string> | string): {
  stdout: string;
  stderr: string;
} {
  return exec(args as any, {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
}

setHelpText($, dollarHelpText);
