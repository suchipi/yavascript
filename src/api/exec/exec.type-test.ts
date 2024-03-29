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
    logging: { trace: console.log },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
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
    logging: { trace: console.log },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
  });
  assert<Is<typeof ret3, void>>();
}

// env and trace specified, return type is void
{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
  });
  assert<Is<typeof ret3, void>>();
}

// env and cwd and trace specified, return type is void
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
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

// only captureOutput true, return type is stdout/stderr string
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

// only captureOutput "utf8", return type is stdout/stderr string
{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// only captureOutput "arraybuffer", return type is stdout/stderr array buffer
{
  type ExpectedType = { stdout: ArrayBuffer; stderr: ArrayBuffer };

  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
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

// other captureOutput/failOnNonZeroStatus combos

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  type ExpectedType = { stdout: ArrayBuffer; stderr: ArrayBuffer };

  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
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

// this combo of captureOutput and failOnNonZeroStatus results in
// the larger return type
{
  type ExpectedType =
    | {
        stdout: ArrayBuffer;
        stderr: ArrayBuffer;
        status: number;
        signal: undefined;
      }
    | {
        stdout: ArrayBuffer;
        stderr: ArrayBuffer;
        status: undefined;
        signal: number;
      };

  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
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
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType =
    | { status: number; signal: undefined }
    | { status: undefined; signal: number };

  const ret1 = exec("blah", {
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// --------------------------- env + trace

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
  });
  assert<Is<typeof ret3, void>>();
}

{
  type ExpectedType = { stdout: string; stderr: string };

  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, void>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, void>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
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
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExpectedType>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExpectedType>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    logging: { trace: console.log },
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExpectedType>>();
}

// ------ with block: false ------
{
  // only block: false, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", { block: false });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], { block: false });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], { block: false });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and cwd specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      cwd: "somewhere",
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      cwd: "somewhere",
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      cwd: "somewhere",
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and env specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      block: false,
      env: { some: "thing" },
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      block: false,
      env: { some: "thing" },
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      block: false,
      env: { some: "thing" },
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and trace specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      block: false,
      logging: { trace: console.log },
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      block: false,
      logging: { trace: console.log },
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      block: false,
      logging: { trace: console.log },
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // block: false cwd and env specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      cwd: "somewhere",
      env: { some: "thing" },
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      cwd: "somewhere",
      env: { some: "thing" },
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      cwd: "somewhere",
      env: { some: "thing" },
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // block: false cwd and trace specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      block: false,
      cwd: "somewhere",
      logging: { trace: console.log },
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      block: false,
      cwd: "somewhere",
      logging: { trace: console.log },
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      block: false,
      cwd: "somewhere",
      logging: { trace: console.log },
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // block: false env and trace specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // block: false env and cwd and trace specified, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      cwd: "somewhere",
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      cwd: "somewhere",
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      cwd: "somewhere",
      env: { some: "thing" },
      logging: { trace: console.log },
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and failOnNonZeroStatus true, return type is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and failOnNonZeroStatus false, return type of wait is status/signal
  {
    type ExpectedType = {
      wait():
        | { status: number; signal: undefined }
        | { status: undefined; signal: number };
    };

    const ret1 = exec("blah", {
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and captureOutput false, return type is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      captureOutput: false,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: false,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: false,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and captureOutput true, return type of wait is stdout/stderr string
  {
    type ExpectedType = {
      wait(): { stdout: string; stderr: string };
    };

    const ret1 = exec("blah", {
      captureOutput: true,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: true,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: true,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and captureOutput "utf8", return type of wait is stdout/stderr string
  {
    type ExpectedType = {
      wait(): { stdout: string; stderr: string };
    };

    const ret1 = exec("blah", {
      captureOutput: "utf8",
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: "utf8",
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: "utf8",
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // only block: false and captureOutput "arraybuffer", return type of wait is stdout/stderr array buffer
  {
    type ExpectedType = {
      wait(): { stdout: ArrayBuffer; stderr: ArrayBuffer };
    };

    const ret1 = exec("blah", {
      captureOutput: "arraybuffer",
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: "arraybuffer",
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: "arraybuffer",
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // block: false and captureOutput and failOnNonZeroStatus default values, return type of wait is void
  {
    type ExpectedType = { wait(): void };

    const ret1 = exec("blah", {
      captureOutput: false,
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: false,
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: false,
      failOnNonZeroStatus: true,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // the big one (string 1)
  {
    type ExpectedType = {
      wait(): { stdout: string; stderr: string } & (
        | { status: number; signal: undefined }
        | { status: undefined; signal: number }
      );
    };

    const ret1 = exec("blah", {
      captureOutput: "utf8",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: "utf8",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: "utf8",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // the big one (string 2)
  {
    type ExpectedType = {
      wait(): { stdout: string; stderr: string } & (
        | { status: number; signal: undefined }
        | { status: undefined; signal: number }
      );
    };

    const ret1 = exec("blah", {
      captureOutput: true,
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: true,
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }

  // the big one (arraybuffer)
  {
    type ExpectedType = {
      wait(): { stdout: ArrayBuffer; stderr: ArrayBuffer } & (
        | { status: number; signal: undefined }
        | { status: undefined; signal: number }
      );
    };

    const ret1 = exec("blah", {
      captureOutput: "arraybuffer",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret1, ExpectedType>>();

    const ret2 = exec(["blah"], {
      captureOutput: "arraybuffer",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret2, ExpectedType>>();

    const ret3 = exec(["blah", "blah"], {
      captureOutput: "arraybuffer",
      failOnNonZeroStatus: false,
      block: false,
    });
    assert<Is<typeof ret3, ExpectedType>>();
  }
}
