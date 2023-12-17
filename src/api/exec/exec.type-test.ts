/// <reference path="../../../yavascript.d.ts" />
import { assert, Is } from "typescript-assert-utils";

// no options specified
{
  const ret1 = exec("blah");
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"]);
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"]);
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// empty options specified
{
  const ret1 = exec("blah", {});
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {});
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {});
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only cwd specified
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only env specified
{
  const ret1 = exec("blah", {
    env: { some: "thing" },
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only trace specified
{
  const ret1 = exec("blah", {
    trace: console.log,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    trace: console.log,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    trace: console.log,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// cwd and env specified
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// cwd and trace specified
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    trace: console.log,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// env and trace specified
{
  const ret1 = exec("blah", {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// env and cwd and trace specified
{
  const ret1 = exec("blah", {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    cwd: "somewhere",
    env: { some: "thing" },
    trace: console.log,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only failOnNonZeroStatus true
{
  const ret1 = exec("blah", {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only failOnNonZeroStatus false
{
  const ret1 = exec("blah", {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only captureOutput false
{
  const ret1 = exec("blah", {
    captureOutput: false,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// only captureOutput true
{
  const ret1 = exec("blah", {
    captureOutput: true,
  });
  assert<Is<typeof ret1, ExecResult<string, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
  });
  assert<Is<typeof ret2, ExecResult<string, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
  });
  assert<Is<typeof ret3, ExecResult<string, false>>>();
}

// only captureOutput "utf8"
{
  const ret1 = exec("blah", {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret1, ExecResult<string, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret2, ExecResult<string, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "utf8",
  });
  assert<Is<typeof ret3, ExecResult<string, false>>>();
}

// only captureOutput "arraybuffer"
{
  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
  });
  assert<Is<typeof ret1, ExecResult<ArrayBuffer, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
  });
  assert<Is<typeof ret2, ExecResult<ArrayBuffer, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
  });
  assert<Is<typeof ret3, ExecResult<ArrayBuffer, false>>>();
}

// captureOutput and failOnNonZeroStatus default values
{
  const ret1 = exec("blah", {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });

  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  const ret1 = exec("blah", {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExecResult<never, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExecResult<never, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: false,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExecResult<never, false>>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  const ret1 = exec("blah", {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExecResult<string, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExecResult<string, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExecResult<string, false>>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  const ret1 = exec("blah", {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExecResult<string, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExecResult<string, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "utf8",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExecResult<string, false>>>();
}

// other captureOutput/failOnNonZeroStatus combos

{
  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret1, ExecResult<ArrayBuffer, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret2, ExecResult<ArrayBuffer, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: true,
  });
  assert<Is<typeof ret3, ExecResult<ArrayBuffer, false>>>();
}

{
  const ret1 = exec("blah", {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExecResult<string, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExecResult<string, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: true,
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExecResult<string, false>>>();
}

{
  const ret1 = exec("blah", {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret1, ExecResult<ArrayBuffer, false>>>();

  const ret2 = exec(["blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret2, ExecResult<ArrayBuffer, false>>>();

  const ret3 = exec(["blah", "blah"], {
    captureOutput: "arraybuffer",
    failOnNonZeroStatus: false,
  });
  assert<Is<typeof ret3, ExecResult<ArrayBuffer, false>>>();
}

// .wait changes Completed from false to true
{
  var ret1: ExecResult<never, false> = null as any;
  var ret1_waited = ret1.wait();
  assert<Is<typeof ret1_waited, ExecResult<never, true>>>();

  var ret2: ExecResult<string, false> = null as any;
  var ret2_waited = ret2.wait();
  assert<Is<typeof ret2_waited, ExecResult<string, true>>>();

  var ret3: ExecResult<ArrayBuffer, false> = null as any;
  var ret3_waited = ret3.wait();
  assert<Is<typeof ret3_waited, ExecResult<ArrayBuffer, true>>>();
}
