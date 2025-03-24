import * as std from "quickjs:std";
import { toArgv } from "./to-argv";
import { env } from "../env";
import { makeErrorWithProperties } from "../../error-with-properties";
import { logger } from "../logger";
import { assert } from "../assert";
import type { Path } from "../path";
import { ChildProcess } from "./ChildProcess";
import { types } from "../types";
import { quote } from "../strings";

const exec = (
  args: Array<string | Path | number> | string | Path,
  options: {
    cwd?: string | Path;
    env?: { [key: string | number]: string | number | boolean };
    failOnNonZeroStatus?: boolean;
    captureOutput?: boolean | "utf8" | "arraybuffer";
    logging?: {
      trace?: (...args: Array<any>) => void;
      info?: (...args: Array<any>) => void;
    };
    block?: boolean;
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
    logging: { trace = logger.trace, info = logger.info } = {},
    block = true,
  } = options;

  assert.type(
    failOnNonZeroStatus,
    types.boolean,
    "when present, 'failOnNonZeroStatus' option must be a boolean"
  );
  assert.type(
    captureOutput,
    types.or(
      types.boolean,
      types.exactString("utf8"),
      types.exactString("arraybuffer")
    ),
    "when present, 'captureOutput' option must be either a boolean or one of the strings 'utf8' or 'arraybuffer'"
  );

  assert.type(
    trace,
    types.Function,
    "when present, 'options.logging.trace' must be a function"
  );

  assert.type(
    info,
    types.Function,
    "when present, 'options.logging.info' must be a function"
  );

  assert.type(
    block,
    types.boolean,
    "when present, 'block' option must be a boolean"
  );

  const child = new ChildProcess(args, { cwd, env, logging: { trace } });

  let tmpOut: FILE | null = null;
  let tmpErr: FILE | null = null;
  if (captureOutput) {
    tmpOut = std.tmpfile();
    child.stdio.out = tmpOut!;
    tmpErr = std.tmpfile();
    child.stdio.err = tmpErr!;
  }

  let result: ReturnType<typeof child.waitUntilComplete> | null = null;
  try {
    info(
      `exec: ${child.args
        .map((arg) => (/[^A-Za-z\-0-9_=\/]/.test(arg) ? quote(arg) : arg))
        .join(" ")}`
    );
    child.start();

    const waiter = {
      wait() {
        try {
          result = child.waitUntilComplete();
          if (result.status !== 0 && !failOnNonZeroStatus) {
            info(`  exec -> ${JSON.stringify(result)}`);
          }

          let stdout: string | ArrayBuffer | null = null;
          let stderr: string | ArrayBuffer | null = null;

          if (tmpOut != null && tmpErr != null) {
            if (captureOutput === "arraybuffer") {
              const outLen = tmpOut.tell();
              const errLen = tmpErr.tell();
              stdout = new ArrayBuffer(outLen);
              stderr = new ArrayBuffer(errLen);

              // seek back to beginning
              tmpOut.seek(0, std.SEEK_SET);
              tmpErr.seek(0, std.SEEK_SET);

              const outBytesRead = tmpOut.read(stdout, 0, outLen);
              if (outBytesRead !== outLen) {
                // throwing an error at this point seems kinda hostile idk, like the
                // process has already run to completion, you know? this *shouldn't*
                // ever happen, in theory, but...
                trace(
                  `WEIRD! stdout reported it was ${outLen}, but when we read it back, it was ${outBytesRead}. Continuing anyway...`
                );
              }

              const errBytesRead = tmpErr.read(stderr, 0, errLen);
              if (errBytesRead !== errLen) {
                trace(
                  `WEIRD! stderr reported it was ${errLen}, but when we read it back, it was ${errBytesRead}. Continuing anyway...`
                );
              }
            } else {
              // captureOutput is either true or "utf8"

              // need to seek to beginning to read the data that was written
              tmpOut.seek(0, std.SEEK_SET);
              tmpErr.seek(0, std.SEEK_SET);
              stdout = tmpOut.readAsString();
              stderr = tmpErr.readAsString();
            }
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
            if (failOnNonZeroStatus) {
              return { stdout, stderr };
            } else {
              return { stdout, stderr, ...result };
            }
          } else {
            throw new Error(
              "Internal error: tmpOut and tmpErr weren't set, but attempted to return stdout and stderr. This indicates a bug in the exec function"
            );
          }
        } catch (err) {
          trace("exec error:", err);
          throw err;
        } finally {
          if (tmpOut != null) tmpOut.close();
          if (tmpErr != null) tmpErr.close();
        }
      },
    };

    if (block) {
      return waiter.wait();
    } else {
      return waiter;
    }
  } catch (err) {
    trace("exec error:", err);
    throw err;
  }
};

export { exec };

export function $(args: Array<string | Path | number> | string | Path): {
  stdout: string;
  stderr: string;
} {
  return exec(args as any, {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
}

exec.toArgv = toArgv;
