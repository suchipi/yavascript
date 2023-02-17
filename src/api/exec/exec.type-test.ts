import { assert, Is } from "typescript-assert-utils";

// no options specified, return type is void
{
  const ret1 = exec("blah");
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"]);
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"]);
  assert<Is<typeof ret3, void>>();
}

// empty options specified, return type is void
{
  const ret1 = exec("blah", {});
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {});
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {});
  assert<Is<typeof ret3, void>>();
}

// only cwd specified, return type is void
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
  });
  assert<Is<typeof ret3, void>>();
}

// only env specified, return type is void
{
  const ret1 = exec("blah", {
    env: { some: "thing" },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
  });
  assert<Is<typeof ret3, void>>();
}

// only trace specified, return type is void
{
  const ret1 = exec("blah", {
    trace: console.log,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
  });
  assert<Is<typeof ret3, void>>();
}

// cwd and env specified, return type is void
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret3, void>>();
}

// cwd and trace specified, return type is void
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret3, void>>();
}

// env and trace specified, return type is void
{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret3, void>>();
}

// env and cwd and trace specified, return type is void
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret3, void>>();
}

// only failOnNonZeroStatus true, return type is void
{
  const ret1 = exec("blah", {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

// only failOnNonZeroStatus false, return type is status/signal
{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// only captureOutput false, return type is void
{
  const ret1 = exec("blah", {
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

// only captureOutput true, return type is stdout/stderr
{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// captureOutput and failOnNonZeroStatus default values, return type is void
{
  const ret1 = exec("blah", {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// this combo of captureOutput and failOnNonZeroStatus results in
// the larger return type
{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// now to mix some base exec options (cwd, env, trace) with those...

// --------------------------- just cwd

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- just env

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- just trace

{
  const ret1 = exec("blah", {
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- cwd + env

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- cwd + trace

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- env + trace

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- cwd + env + trace

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType =
    | {
        stdout: string;
        stderr: string;
        status: number;
        signal: undefined;
      }
    | {
        stdout: string;
        stderr: string;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}
