import * as fs from "fs";
import { describe, expect, test } from "vitest";
import { evaluate } from "./test-helpers";
import {
  KEYS,
  historyFilePath,
  startReplSession,
  tempConfigDir,
} from "./repl-helpers";

/**
 * InteractivePrompt is driven by running a script that constructs one and
 * calls start(). start() only installs a stdin read handler and returns, so
 * the process stays alive on the event loop and the test can type at it.
 */
function promptScript(body: string): Array<string> {
  return ["-e", body];
}

const ECHO_INPUT = `
  new InteractivePrompt(
    (input) => { console.log("got:", JSON.stringify(input)); },
    { prompt: () => "ip> " },
  ).start();
`;

describe("InteractivePrompt", () => {
  test("passes each accepted line to handleInput", async () => {
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      promptMarker: "ip> ",
    });
    await session.line("hello");
    await session.line("world");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "ip> hello
      got: "hello"
      ip> world
      got: "world"
      ip> 
      ",
      }
    `);
  });

  test("uses '> ' when no prompt option is given", async () => {
    const session = await startReplSession(
      promptScript(
        `new InteractivePrompt((i) => console.log("got:", i)).start();`,
      ),
    );
    await session.line("x");
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "> x
      got: x
      > 
      "
    `);
  });

  test("draws the line with printInput when one is supplied", async () => {
    const session = await startReplSession(
      promptScript(`
        new InteractivePrompt((i) => console.log("got:", i), {
          printInput: (input) => { std.puts("[" + input + "]"); },
        }).start();
      `),
    );
    await session.line("hi");
    await session.exit();
    // one repaint per keystroke, because supplying printInput opts out of the
    // engine's incremental echo
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "> [h][hi]
      got: hi
      > 
      "
    `);
  });

  test("submits each line as-is, with no multiline continuation", async () => {
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      promptMarker: "ip> ",
    });
    // the js repl would buffer this and prompt for more; InteractivePrompt
    // has no isInputComplete, so it submits immediately
    await session.line("const x = {");
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> const x = {
      got: "const x = {"
      ip> 
      "
    `);
  });
});

describe("InteractivePrompt editing", () => {
  test("shares the repl's line editing", async () => {
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      promptMarker: "ip> ",
    });
    // backspace
    await session.input(`abcX${KEYS.backspace}${KEYS.enter}`);
    // ^A / ^E
    await session.input(`bc${KEYS.ctrlA}a${KEYS.ctrlE}d${KEYS.enter}`);
    // ^K then ^Y
    await session.input(
      `abcdef${KEYS.ctrlA}${KEYS.ctrlK}${KEYS.ctrlY}${KEYS.enter}`,
    );
    // M-u upcases a word
    await session.input(`foo bar${KEYS.ctrlA}${KEYS.altU}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> abcXabc
      got: "abc"
      ip> bcabcd
      got: "abcd"
      ip> abcdefabcdef
      got: "abcdef"
      ip> foo barFOO bar
      got: "FOO bar"
      ip> 
      "
    `);
  });

  test("ctrl-d on an empty line exits", async () => {
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      promptMarker: "ip> ",
    });
    session.send(KEYS.ctrlD);
    await session.finish();
    expect(session.result().code).toBe(0);
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> 
      "
    `);
  });

  // generic-repl.js called std.exit(0), which no longer exists in the quickjs
  // fork, so this used to throw "std.exit is not a function".
  test("two ctrl-c presses exit cleanly", async () => {
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      promptMarker: "ip> ",
    });
    session.send(KEYS.ctrlC, KEYS.ctrlC);
    await session.finish();
    expect(session.result().code).toBe(0);
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "ip> 
      (Press Ctrl-C again to quit)
      ip> 
      ",
      }
    `);
  });
});

const COMPLETION_PROMPT = `
  new InteractivePrompt((i) => console.log("got:", i), {
    prompt: () => "ip> ",
    getCompletions: (line, pos) => ({
      candidates: ["apple", "apricot", "banana"].filter((c) =>
        c.startsWith(line.slice(0, pos)),
      ),
      prefixLength: pos,
      context: { apple: (a) => a, apricot: {}, banana: "fruit" },
    }),
  }).start();
`;

describe("InteractivePrompt completion", () => {
  test("tab fills in the longest common prefix of the candidates", async () => {
    const session = await startReplSession(promptScript(COMPLETION_PROMPT), {
      promptMarker: "ip> ",
    });
    // "a" matches apple and apricot, whose shared prefix is "ap"
    await session.input(`a${KEYS.tab}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> ap
      got: ap
      ip> 
      "
    `);
  });

  test("tab twice lists the candidates", async () => {
    const session = await startReplSession(promptScript(COMPLETION_PROMPT), {
      promptMarker: "ip> ",
    });
    await session.input(`a${KEYS.tab}${KEYS.tab}`, "apricot");
    await session.input(`${KEYS.ctrlX}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> ap
      apple    apricot  
      ip> ap
      ip> 
      "
    `);
  });

  // The "( for a function, . for an object" behavior belongs to the js repl,
  // not here: InteractivePrompt appends nothing unless you say what to append,
  // even when the context would have supported the old guesswork.
  test("a lone candidate gains nothing by default", async () => {
    const session = await startReplSession(promptScript(COMPLETION_PROMPT), {
      promptMarker: "ip> ",
    });
    // apple is a function and apricot an object in the context object
    await session.input(`appl${KEYS.tab}${KEYS.tab}${KEYS.enter}`);
    await session.input(`apr${KEYS.tab}${KEYS.tab}${KEYS.enter}`);
    await session.input(`b${KEYS.tab}${KEYS.tab}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> apple
      got: apple
      ip> apricot
      got: apricot
      ip> banana
      got: banana
      ip> 
      "
    `);
  });

  test("a prefixLength of 0 types the candidate in whole", async () => {
    const session = await startReplSession(
      promptScript(`
        new InteractivePrompt((i) => console.log("got:", i), {
          prompt: () => "ip> ",
          getCompletions: (line, cursorIndex) => {
            const typed = line.slice(0, cursorIndex);
            const matches = ["banana"].filter((c) => c.startsWith(typed));
            // the word is already whole, so offer what follows it instead of
            // completing it again
            if (matches.length === 1 && matches[0] === typed) {
              return { candidates: ["()"], prefixLength: 0 };
            }
            return { candidates: matches, prefixLength: typed.length };
          },
        }).start();
      `),
      { promptMarker: "ip> " },
    );
    // the first tab completes the word, the second offers what follows it
    await session.input(`b${KEYS.tab}${KEYS.tab}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> banana()
      got: banana()
      ip> 
      "
    `);
  });

  test("completing a word does not also add what follows it", async () => {
    const session = await startReplSession(
      promptScript(`
        new InteractivePrompt((i) => console.log("got:", i), {
          prompt: () => "ip> ",
          getCompletions: (line, cursorIndex) => {
            const typed = line.slice(0, cursorIndex);
            const matches = ["banana"].filter((c) => c.startsWith(typed));
            // the word is already whole, so offer what follows it instead of
            // completing it again
            if (matches.length === 1 && matches[0] === typed) {
              return { candidates: ["()"], prefixLength: 0 };
            }
            return { candidates: matches, prefixLength: typed.length };
          },
        }).start();
      `),
      { promptMarker: "ip> " },
    );
    await session.input(`b${KEYS.tab}${KEYS.enter}`);
    await session.exit();
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> banana
      got: banana
      ip> 
      "
    `);
  });
});

describe("InteractivePrompt history", () => {
  test("historyFileName persists history across sessions", async () => {
    const configDir = tempConfigDir("interactive-prompt-history");
    const args = promptScript(`
      new InteractivePrompt((i) => console.log("got:", i), {
        prompt: () => "ip> ",
        historyFileName: "my_prompt_history.txt",
      }).start();
    `);

    const first = await startReplSession(args, {
      configDir,
      promptMarker: "ip> ",
    });
    await first.line("first line");
    await first.line("second line");
    await first.exit();

    expect(
      fs.readFileSync(
        historyFilePath(configDir, "my_prompt_history.txt"),
        "utf-8",
      ),
    ).toMatchInlineSnapshot(`
      "first line
      second line
      "
    `);

    const second = await startReplSession(args, {
      configDir,
      promptMarker: "ip> ",
    });
    await second.input(`${KEYS.up}${KEYS.up}${KEYS.enter}`);
    await second.exit();
    expect(second.result().stdout).toMatchInlineSnapshot(`
      "ip> second linefirst line
      got: first line
      ip> 
      "
    `);
  });

  test("without historyFileName nothing is written to the config dir", async () => {
    const configDir = tempConfigDir("interactive-prompt-no-history");
    const session = await startReplSession(promptScript(ECHO_INPUT), {
      configDir,
      promptMarker: "ip> ",
    });
    await session.line("remembered?");
    await session.exit();

    // up-arrow has nothing to recall, and no file was created
    expect(
      fs.existsSync(historyFilePath(configDir, "my_prompt_history.txt")),
    ).toBe(false);
    expect(session.result().stdout).toMatchInlineSnapshot(`
      "ip> remembered?
      got: "remembered?"
      ip> 
      "
    `);
  });
});

describe("InteractivePrompt argument validation", () => {
  test("handleInput must be a function", async () => {
    expect(await evaluate(`new InteractivePrompt("nope")`))
      .toMatchInlineSnapshot(`
        {
          "code": 1,
          "error": null,
          "stderr": "TypeError: 'handleInput' must be a function
          at somewhere
        {
          fileName: "yavascript-internals/dist/bundles/layer1.js"
          lineNumber: <redacted>
          columnNumber: <redacted>
        }
        ",
          "stdout": "",
        }
      `);
  });

  test("options must be an object", async () => {
    expect(await evaluate(`new InteractivePrompt(() => {}, 5)`))
      .toMatchInlineSnapshot(`
        {
          "code": 1,
          "error": null,
          "stderr": "TypeError: when present, 'options' must be an object
          at somewhere
        {
          fileName: "yavascript-internals/dist/bundles/layer1.js"
          lineNumber: <redacted>
          columnNumber: <redacted>
        }
        ",
          "stdout": "",
        }
      `);
  });

  test("options.prompt must be a function", async () => {
    expect(await evaluate(`new InteractivePrompt(() => {}, { prompt: "> " })`))
      .toMatchInlineSnapshot(`
        {
          "code": 1,
          "error": null,
          "stderr": "TypeError: when present, 'options.prompt' must be a function
          at somewhere
        {
          fileName: "yavascript-internals/dist/bundles/layer1.js"
          lineNumber: <redacted>
          columnNumber: <redacted>
        }
        ",
          "stdout": "",
        }
      `);
  });

  test("options.historyFileName must be a string", async () => {
    expect(
      await evaluate(`new InteractivePrompt(() => {}, { historyFileName: 5 })`),
    ).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": null,
        "stderr": "TypeError: when present, 'options.historyFileName' must be a string
        at somewhere
      {
        fileName: "yavascript-internals/dist/bundles/layer1.js"
        lineNumber: <redacted>
        columnNumber: <redacted>
      }
      ",
        "stdout": "",
      }
    `);
  });
});
