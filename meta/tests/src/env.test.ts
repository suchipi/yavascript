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

test("readEnvBool - normative case", async () => {
  for (const [value, expectedReturn] of Object.entries({
    0: false,
    1: true,
    false: false,
    true: true,
    False: false,
    True: true,
    FALSE: false,
    TRUE: true,
  })) {
    const result = await evaluate(`readEnvBool("BLAH_BLAH", null)`, {
      env: { BLAH_BLAH: value },
    });
    expect(result).toMatchObject({
      code: 0,
      error: false,
      stderr: "",
    });
    expect(result.stdout.trim()).toBe(String(expectedReturn));
  }
});

test("readEnvBool - unset var", async () => {
  const result = await evaluate(`readEnvBool("BLAH_BLAH", null)`, {
    env: {},
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "null
    ",
    }
  `);

  const result2 = await evaluate(
    `
      const myObj = { hi: true };
      const result = readEnvBool("BLAH_BLAH", myObj);
      console.log(result === myObj)
    `,
    {
      env: {},
    }
  );
  expect(result2).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    ",
    }
  `);
});

test("readEnvBool - invalid value", async () => {
  const result = await evaluate(`readEnvBool("BLAH_BLAH", null)`, {
    env: {
      BLAH_BLAH: "potato",
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "readEnvBool: environment variable "BLAH_BLAH" was "potato", which doesn't look like a boolean. Returning the fallback value of null.
    ",
      "stdout": "null
    ",
    }
  `);
});

test("readEnvBool - invalid value with logging override", async () => {
  const result = await evaluate(
    `readEnvBool("BLAH_BLAH", null, { warn: console.log })`,
    {
      env: {
        BLAH_BLAH: "potato",
      },
    }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "readEnvBool: environment variable "BLAH_BLAH" was "potato", which doesn't look like a boolean. Returning the fallback value of null.
    null
    ",
    }
  `);
});

test("setting env interacts with readEnvBool as expected", async () => {
  const result = await evaluate(
    `
      console.log(readEnvBool("BLAH_BLAH", null));
      env.BLAH_BLAH = "FALSE";
      console.log(readEnvBool("BLAH_BLAH", null));
      delete env.BLAH_BLAH;
      console.log(readEnvBool("BLAH_BLAH", null));
    `,
    {
      env: {
        BLAH_BLAH: "true",
      },
    }
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "true
    false
    null
    ",
    }
  `);
});
