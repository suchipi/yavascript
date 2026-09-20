import print from "@suchipi/print";
import { sanitizers, spawn, Options as SpawnOptions } from "first-base";
import * as inspectOptions from "../../../src/layer1/inspect-options";
import rootDir from "../../root-dir";
import { getBinaryPath, binaryPath } from "../vitest/helpers";

export { getBinaryPath, binaryPath };
export { rootDir };

export type EvaluateResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  error: Error | null;
};

export async function runYavascript(
  args: Array<string>,
  options: SpawnOptions & { cleanResult?: boolean } = {},
) {
  const runContext = spawn(binaryPath, args, {
    cwd: rootDir(),
    ...options,
  });
  await runContext.completion;
  if (options.cleanResult === false) {
    return runContext.result;
  } else {
    return runContext.cleanResult();
  }
}

export async function evaluate(
  code: string,
  options: SpawnOptions & { cleanResult?: boolean } = {},
): Promise<EvaluateResult> {
  return runYavascript(["-e", code], options);
}

export type TimedResult = EvaluateResult & { timedOut: boolean };

/**
 * How long a run gets before we call it hung. The runs this is used for
 * either finish in well under a second or never finish at all, so the exact
 * value only needs to be far above process startup time.
 */
export const HANG_TIMEOUT = 5000;

/**
 * Like {@link runYavascript}, but SIGKILLs the process if it hasn't exited
 * within `timeout` ms and reports that via `timedOut`. Use it for behavior
 * that is supposed to terminate, so that a regression fails the test instead
 * of hanging the suite.
 */
export async function runYavascriptWithTimeout(
  args: Array<string>,
  options: SpawnOptions & { timeout?: number; stdin?: string } = {},
): Promise<TimedResult> {
  const { timeout = HANG_TIMEOUT, stdin, ...spawnOptions } = options;

  const runContext = spawn(binaryPath, args, {
    cwd: rootDir(),
    ...spawnOptions,
  });

  if (stdin != null) {
    runContext.write(stdin);
    runContext.close("stdin");
  }

  let timedOut = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  await Promise.race([
    runContext.completion,
    new Promise<void>((resolve) => {
      timer = setTimeout(() => {
        timedOut = true;
        resolve();
      }, timeout);
    }),
  ]);
  if (timer != null) clearTimeout(timer);

  if (timedOut) {
    runContext.kill("SIGKILL");
    await runContext.completion;
  }

  return { ...runContext.cleanResult(), timedOut };
}

export async function evaluateWithTimeout(
  code: string,
  options: SpawnOptions & { timeout?: number; stdin?: string } = {},
): Promise<TimedResult> {
  return runYavascriptWithTimeout(["-e", code], options);
}

export function inspect(value: any): string {
  // options to inspect here match what is given to console.log
  return print(value, inspectOptions.forPrint());
}

const removedSanitizers: Record<
  string,
  { index: number; sanitizer: (str: string) => string }
> = {};

export function removeSanitizer(sanitizerName: string) {
  const index = sanitizers.findIndex(
    (sanitizer) => sanitizer.name === sanitizerName,
  );
  if (index === -1) {
    throw new Error(`Couldn't find ${JSON.stringify(sanitizerName)} sanitizer`);
  }

  removedSanitizers[sanitizerName] = {
    index,
    sanitizer: sanitizers[index],
  };

  sanitizers[index] = function noop(str: string) {
    return str;
  };
}

export function restoreSanitizer(sanitizerName: string) {
  const skipped = removedSanitizers[sanitizerName];
  if (skipped == null) {
    throw new Error(
      `Sanitizer ${JSON.stringify(sanitizerName)} isn't in the list of sanitizers removed by 'removeSanitizer'.`,
    );
  }

  sanitizers[skipped.index] = skipped.sanitizer;
}
