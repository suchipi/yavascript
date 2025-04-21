import { evaluate, binaryPath, inspect } from "./test-helpers";

test("reading env", async () => {
  const result = await evaluate(`env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "yeah
    ",
    }
  `);
});

test("setting env", async () => {
  const result = await evaluate(`env.BLAH_BLAH = 'yes'; env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "yes
    ",
    }
  `);
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
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "exec: <yavascript binary> -e "env.BLAH_BLAH"
    ",
      "stdout": "yes
    ",
    }
  `);
});

test("clearing env", async () => {
  const result = await evaluate(`delete env.BLAH_BLAH; typeof env.BLAH_BLAH`, {
    env: { BLAH_BLAH: "yeah" },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "undefined
    ",
    }
  `);
});

test("env is printable", async () => {
  const result = await evaluate(`env`, {
    env: { BLAH_BLAH: "yeah", woohoo: "yes" },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      BLAH_BLAH: "yeah"
      woohoo: "yes"
    }
    ",
    }
  `);
});

test("own keys of env object", async () => {
  const result = await evaluate(`JSON.stringify(Object.keys(env))`, {
    env: { BLAH_BLAH: "yeah", woohoo: "yes" },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "["BLAH_BLAH","woohoo"]
    ",
    }
  `);
});
