///<reference types="@test-it/core/globals" />
import { evaluate, binaryPath, inspect } from "../test-helpers";

test("reading env", async () => {
  const result = await evaluate(`env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "yeah\n",
  });
});

test("setting env", async () => {
  const result = await evaluate(`env.BLAH_BLAH = 'yes'; env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "yes\n",
  });
});

test("setting env affects child processes", async () => {
  const result = await evaluate(
    `env.BLAH_BLAH = 'yes'; exec([${JSON.stringify(
      binaryPath
    )}, "-e", "env.BLAH_BLAH"])`,
    {
      env: { BLAH_BLAH: "yeah" },
    }
  );
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "yes\n",
  });
});

test("clearing env", async () => {
  const result = await evaluate(`delete env.BLAH_BLAH; typeof env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: "undefined\n",
  });
});

test("env is printable", async () => {
  const result = await evaluate(`env`, {
    env: { BLAH_BLAH: "yeah", woohoo: "yes" },
  });
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect({ BLAH_BLAH: "yeah", woohoo: "yes" }) + "\n",
  });
});

test("own keys of env object", async () => {
  const result = await evaluate(`Object.keys(env)`, {
    env: { BLAH_BLAH: "yeah", woohoo: "yes" },
  });
  expect(result).toEqual({
    code: 0,
    error: false,
    stderr: "",
    stdout: inspect(["BLAH_BLAH", "woohoo"]) + "\n",
  });
});
