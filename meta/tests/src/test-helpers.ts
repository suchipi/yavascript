import print from "@suchipi/print";
import { spawn, Options as SpawnOptions } from "first-base";
import * as inspectOptions from "../../../src/inspect-options";
import rootDir from "../../root-dir";
import { getBinaryPath, binaryPath } from "../jest/helpers";

export { getBinaryPath, binaryPath };
export { rootDir };

export type EvaluateResult = {
  stdout: string;
  stderr: string;
  code: number | null;
  error: boolean;
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

export function inspect(value: any): string {
  // options to inspect here match what is given to console.log
  return print(value, inspectOptions.forPrint());
}
