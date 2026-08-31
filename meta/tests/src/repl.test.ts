import * as fs from "fs";
import { describe, expect, test } from "vitest";
import { spawn } from "first-base";
import { binaryPath, runYavascript } from "./test-helpers";
import {
  CONTINUATION_PROMPT,
  KEYS,
  historyFilePath,
  startReplSession,
  tempConfigDir,
} from "./repl-helpers";

describe("repl", () => {
  test("basic run", async () => {
    const run = spawn(binaryPath);
    await run.outputContains("> ");
    run.write("2 + 2\n");
    await run.outputContains("4");
    run.kill("SIGINT"); // Ctrl-C
    await run.outputContains("Press Ctrl-C again");
    run.kill("SIGINT");
    await run.completion;
    expect(run.cleanResult()).toMatchInlineSnapshot(`
     {
       "code": 0,
       "error": null,
       "stderr": "",
       "stdout": "> 2 + 2
     4
     > 
     (Press Ctrl-C again to quit)
     > 
     ",
     }
    `);
  });

  test("statements work", async () => {
    const run = spawn(binaryPath);
    await run.outputContains("> ");
    run.write("var a = 2 + 2\n");
    await run.outputContains("undefined");
    run.write("a\n");
    await run.outputContains("4");
    run.kill("SIGINT"); // Ctrl-C
    await run.outputContains("Press Ctrl-C again");
    run.kill("SIGINT");
    await run.completion;
    expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> var a = 2 + 2
      undefined
      > a
      4
      > 
      (Press Ctrl-C again to quit)
      > 
      ",
      }
    `);
  });
});

describe("repl eval and print", () => {
  test("prints values of several types", async () => {
    const session = await startReplSession();
    await session.line("2 + 2");
    await session.line('"hello"');
    await session.line("[1, 2, 3]");
    await session.line("({ a: 1 })");
    await session.line("undefined");
    await session.line("null");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 2 + 2
      4
      > "hello"
      "hello"
      > [1, 2, 3]
      [
        1
        2
        3
      ]
      > ({ a: 1 })
      {
        a: 1
      }
      > undefined
      undefined
      > null
      null
      > 
      ",
      }
    `);
  });

  test("console.clear() prints nothing (the NOTHING sentinel)", async () => {
    const session = await startReplSession();
    await session.line("console.clear()");
    await session.line("1");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> console.clear()
      > 1
      1
      > 
      ",
      }
    `);
  });

  test("_ holds the last result", async () => {
    const session = await startReplSession();
    await session.line("40 + 2");
    await session.line("_");
    await session.line("_ * 2");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 40 + 2
      42
      > _
      42
      > _ * 2
      84
      > 
      ",
      }
    `);
  });

  test("_error holds the last error", async () => {
    const session = await startReplSession();
    await session.line("notdefined");
    await session.line("_error.name");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> notdefined
      ReferenceError: 'notdefined' is not defined
        at somewhere
      {
        fileName: "<internal>/quickjs.c"
        lineNumber: <redacted>
        columnNumber: <redacted>
      }
      > _error.name
      "ReferenceError"
      > 
      ",
      }
    `);
  });

  test("blank lines are a no-op", async () => {
    const session = await startReplSession();
    await session.line("");
    await session.line("");
    await session.line("1 + 1");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 
      > 
      > 1 + 1
      2
      > 
      ",
      }
    `);
  });
});

describe("repl errors", () => {
  test("a thrown error is printed and the repl keeps going", async () => {
    const session = await startReplSession();
    await session.line('throw new Error("boom")');
    await session.line("1 + 1");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> throw new Error("boom")
      Error: boom
        at somewhere
      {
        fileName: "<rootDir>/<evalScript>"
        lineNumber: <redacted>
        columnNumber: <redacted>
      }
      > 1 + 1
      2
      > 
      ",
      }
    `);
  });

  test("a syntax error is printed and the repl keeps going", async () => {
    const session = await startReplSession();
    await session.line("1 +");
    await session.line("1 + 1");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 +
      SyntaxError: unexpected token in expression: ''
        at somewhere
      {
        fileName: "<rootDir>/<evalScript>"
        lineNumber: <redacted>
        columnNumber: <redacted>
      }
      > 1 + 1
      2
      > 
      ",
      }
    `);
  });
});

describe("repl multiline", () => {
  test("an unclosed brace continues onto the next line", async () => {
    const session = await startReplSession();
    await session.line("const x = {", CONTINUATION_PROMPT);
    await session.line("a: 1,", CONTINUATION_PROMPT);
    await session.line("}");
    await session.line("x");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> const x = {
      {  ...     a: 1,
      {  ...     }
      undefined
      > x
      {
        a: 1
      }
      > 
      ",
      }
    `);
  });

  test("nesting deepens the state prefix and the auto-indent", async () => {
    const session = await startReplSession();
    await session.line("function f() {", CONTINUATION_PROMPT);
    await session.line("if (true) {", CONTINUATION_PROMPT);
    await session.line("return 42", CONTINUATION_PROMPT);
    await session.line("}", CONTINUATION_PROMPT);
    await session.line("}");
    await session.line("f()");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> function f() {
      {  ...     if (true) {
      {{  ...         return 42
      {{  ...         }
      {  ...     }
      undefined
      > f()
      42
      > 
      ",
      }
    `);
  });

  test("unclosed paren and bracket continue too", async () => {
    const session = await startReplSession();
    await session.line("Math.max(", CONTINUATION_PROMPT);
    await session.line("1, 2)");
    await session.line("[", CONTINUATION_PROMPT);
    await session.line("9]");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> Math.max(
      (  ...     1, 2)
      2
      > [
      [  ...     9]
      [
        9
      ]
      > 
      ",
      }
    `);
  });

  test("an unclosed jsx element continues until its closing tag", async () => {
    const session = await startReplSession(["--lang", "jsx"]);
    await session.line("<div>", CONTINUATION_PROMPT);
    await session.line("hi", CONTINUATION_PROMPT);
    await session.line("</div>");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> <div>
      >  ...     hi
      >  ...     </div>
      -> JSX.createElement('div', null, "hi" )
      {
        $$typeof: Symbol(JSX.Element)
        type: "div"
        props: {
          children: [
            "hi"
          ]
        }
        key: null
      }
      > 
      ",
      }
    `);
  });

  test("an unterminated template literal continues", async () => {
    const session = await startReplSession();
    await session.line("`abc", CONTINUATION_PROMPT);
    await session.line("def`");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \`abc
      \`  ... def\`
      "abc\\ndef"
      > 
      ",
      }
    `);
  });
});

describe("repl directives", () => {
  test("\\h, \\?, \\help and bare ? all print help", async () => {
    const session = await startReplSession();
    await session.line("\\h");
    await session.line("\\?");
    await session.line("\\help");
    await session.line("?");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \\h
      \\h          this help
      \\t          toggle timing display
      \\clear      clear the terminal
      \\q          exit
      > \\?
      \\h          this help
      \\t          toggle timing display
      \\clear      clear the terminal
      \\q          exit
      > \\help
      \\h          this help
      \\t          toggle timing display
      \\clear      clear the terminal
      \\q          exit
      > ?
      \\h          this help
      \\t          toggle timing display
      \\clear      clear the terminal
      \\q          exit
      > 
      ",
      }
    `);
  });

  test("\\t toggles the timing display", async () => {
    const session = await startReplSession();
    await session.line("\\t");
    await session.line("1 + 1");
    await session.line("\\t");
    await session.line("2 + 2");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \\t
      <time> > 1 + 1
      2
      <time> > \\t
      > 2 + 2
      4
      > 
      ",
      }
    `);
  });

  test("\\clear emits the clear-screen escape sequence", async () => {
    const session = await startReplSession();
    await session.line("\\clear");
    await session.exit();
    // cursor home, then erase from cursor to end of screen
    expect(session.raw().stdout).toContain("\x1b[H\x1b[J");
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \\clear
      > 
      ",
      }
    `);
  });

  test("\\q exits", async () => {
    const session = await startReplSession();
    session.send("\\q" + KEYS.enter);
    await session.finish();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \\q
      ",
      }
    `);
  });

  test("an unknown directive is reported", async () => {
    const session = await startReplSession();
    await session.line("\\bogus");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> \\bogus
      Unknown directive: bogus
      > 
      ",
      }
    `);
  });
});

describe("repl cursor motion", () => {
  test("arrow keys move by one character", async () => {
    const session = await startReplSession();
    // "ac" -> left past the closing quote, left past c, insert b
    await session.input(`"ac"${KEYS.left}${KEYS.left}b${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ac"bc"
      "abc"
      > 
      ",
      }
    `);
  });

  test("^B and ^F move by one character, like the arrow keys", async () => {
    const session = await startReplSession();
    await session.input(
      `"ac"${KEYS.ctrlB}${KEYS.ctrlB}b${KEYS.ctrlF}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ac"bc"
      "abc"
      > 
      ",
      }
    `);
  });

  test("the SS3 arrow variants move by one character too", async () => {
    const session = await startReplSession();
    await session.input(
      `"ac"${KEYS.ss3Left}${KEYS.ss3Left}b${KEYS.ss3Right}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ac"bc"
      "abc"
      > 
      ",
      }
    `);
  });

  test("^A and ^E jump to the start and end of the line", async () => {
    const session = await startReplSession();
    await session.input(`bc"${KEYS.ctrlA}"a${KEYS.ctrlE}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> bc""bc"abc"
      "abc"
      > 
      ",
      }
    `);
  });

  test("home and end jump to the start and end of the line", async () => {
    const session = await startReplSession();
    // Home from the end of the line, then upcase: the FIRST word changes. A
    // backward-word jump would have stopped at "bar" and upcased that instead.
    await session.input(`"foo bar"${KEYS.home}${KEYS.altU}${KEYS.enter}`);
    await session.input(`"foo bar"${KEYS.homeTilde}${KEYS.altU}${KEYS.enter}`);
    await session.input(`"foo bar"${KEYS.ss3Home}${KEYS.altU}${KEYS.enter}`);
    // End from the start of the line, then type the closing quote: it lands
    // after "bar". A forward-word jump would have put it after "foo".
    await session.input(`"foo bar${KEYS.ctrlA}${KEYS.end}"${KEYS.enter}`);
    await session.input(`"foo bar${KEYS.ctrlA}${KEYS.endTilde}"${KEYS.enter}`);
    await session.input(`"foo bar${KEYS.ctrlA}${KEYS.ss3End}"${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "foo bar""FOO bar"
      "FOO bar"
      > "foo bar""FOO bar"
      "FOO bar"
      > "foo bar""FOO bar"
      "FOO bar"
      > "foo bar"
      "foo bar"
      > "foo bar"
      "foo bar"
      > "foo bar"
      "foo bar"
      > 
      ",
      }
    `);
  });

  test("M-b and M-f move by word", async () => {
    const session = await startReplSession();
    // back over `bar`, upcase it, then forward over it again and append
    await session.input(
      `"foo bar${KEYS.altB}${KEYS.altU}${KEYS.altF}!"${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "foo barBAR!"
      "foo BAR!"
      > 
      ",
      }
    `);
  });

  test("ctrl-arrow moves by word", async () => {
    const session = await startReplSession();
    await session.input(
      `"foo bar${KEYS.ctrlLeft}${KEYS.altU}${KEYS.ctrlRight}!"${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "foo barBAR!"
      "foo BAR!"
      > 
      ",
      }
    `);
  });

  test("backspace deletes the character before the cursor", async () => {
    const session = await startReplSession();
    await session.input(`1 + 22${KEYS.backspace}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 221 + 2
      3
      > 
      ",
      }
    `);
  });

  test("^H deletes backwards like backspace", async () => {
    const session = await startReplSession();
    await session.input(`1 + 22${KEYS.ctrlH}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 221 + 2
      3
      > 
      ",
      }
    `);
  });

  test("the delete key deletes the character under the cursor", async () => {
    const session = await startReplSession();
    await session.input(`1 + 2X${KEYS.left}${KEYS.del}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 2X
      3
      > 
      ",
      }
    `);
  });

  test("^D deletes forwards when the line is not empty", async () => {
    const session = await startReplSession();
    await session.input(`1 + 2X${KEYS.left}${KEYS.ctrlD}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 2X
      3
      > 
      ",
      }
    `);
  });

  test("^D on an empty line exits", async () => {
    const session = await startReplSession();
    session.send(KEYS.ctrlD);
    await session.finish();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 
      ",
      }
    `);
  });
});

describe("repl kill and yank", () => {
  test("^K kills to end of line and ^Y yanks it back", async () => {
    const session = await startReplSession();
    await session.input(
      `"abcdef"${KEYS.ctrlA}${KEYS.ctrlK}${KEYS.ctrlY}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "abcdef""abcdef"
      "abcdef"
      > 
      ",
      }
    `);
  });

  test("M-k kills to start of line", async () => {
    const session = await startReplSession();
    await session.input(
      `XXXX"ok"${KEYS.ctrlA}${KEYS.altF}${KEYS.altK}${KEYS.ctrlE}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> XXXX"ok""ok"
      "ok"
      > 
      ",
      }
    `);
  });

  test("^W and M-backspace kill the previous word", async () => {
    const session = await startReplSession();
    await session.input(`"ok" + junk${KEYS.ctrlW}"!"${KEYS.enter}`);
    await session.input(`"ok" + junk${KEYS.altBackspace}"!"${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ok" + junk"ok" + "!"
      "ok!"
      > "ok" + junk"ok" + "!"
      "ok!"
      > 
      ",
      }
    `);
  });

  // The kill ring appends when the previous command was also a kill, so two
  // M-d presses yank back as one piece. A single M-d yanks back only "abc",
  // which is what makes this test able to tell the difference.
  test("consecutive kills concatenate into the clipboard", async () => {
    const session = await startReplSession();
    // one kill: the clipboard holds just "abc"
    await session.input(
      `abc${KEYS.ctrlA}${KEYS.altD}"${KEYS.ctrlY}"${KEYS.enter}`,
    );
    // two kills in a row: the clipboard holds both words
    await session.input(
      `abc def${KEYS.ctrlA}${KEYS.altD}${KEYS.altD}"${KEYS.ctrlY}"${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> abc"abc"
      "abc"
      > abc def def"abc def"
      "abc def"
      > 
      ",
      }
    `);
  });
});

describe("repl text transforms", () => {
  test("^T transposes the two characters before the cursor", async () => {
    const session = await startReplSession();
    await session.input(`"ab"${KEYS.left}${KEYS.ctrlT}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ab""a"b
      SyntaxError: expecting ';'
        at somewhere
      {
        fileName: "<rootDir>/<evalScript>"
        lineNumber: <redacted>
        columnNumber: <redacted>
      }
      > 
      ",
      }
    `);
  });

  test("M-t transposes the words either side of the cursor", async () => {
    const session = await startReplSession();
    // the closing quote sits after the second word, so this also pins that
    // transposing keeps whatever followed it
    await session.input(
      `"foo bar"${KEYS.ctrlA}${KEYS.altF}${KEYS.altT}${KEYS.ctrlE}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "foo bar""bar foo"
      "bar foo"
      > 
      ",
      }
    `);
  });

  test("M-u upcases and M-l downcases the next word", async () => {
    const session = await startReplSession();
    await session.input(
      `"foo BAR"${KEYS.ctrlA}${KEYS.altF}${KEYS.altU}${KEYS.altL}${KEYS.ctrlE}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "foo BAR" bar"
      "foo bar"
      > 
      ",
      }
    `);
  });
});

describe("repl misc keys", () => {
  test("^X clears the line", async () => {
    const session = await startReplSession();
    await session.input(`999${KEYS.ctrlX}111${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 999111
      111
      > 
      ",
      }
    `);
  });

  test("^G aborts the line without evaluating it", async () => {
    const session = await startReplSession();
    await session.input(`999${KEYS.ctrlG}`);
    await session.line("111");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 999> 111
      111
      > 
      ",
      }
    `);
  });

  test("^Q inserts the next key literally", async () => {
    const session = await startReplSession();
    // ^A would normally jump to start of line; quoted, it becomes a \x01 char
    await session.input(`"a${KEYS.ctrlQ}${KEYS.ctrlA}b".length${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "ab".length
      3
      > 
      ",
      }
    `);
  });

  test("^J accepts the line, like Enter", async () => {
    const session = await startReplSession();
    await session.input(`1 + 1${KEYS.ctrlJ}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 1
      2
      > 
      ",
      }
    `);
  });

  test("an unbound escape sequence is silently ignored", async () => {
    const session = await startReplSession();
    // \x1b[15~ is F5
    await session.input(`\x1b[15~1 + 1${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 1
      2
      > 
      ",
      }
    `);
  });
});

describe("repl utf-8", () => {
  test("multibyte characters can be typed", async () => {
    const session = await startReplSession();
    await session.line('"héllo".length');
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "héllo".length
      5
      > 
      ",
      }
    `);
  });

  test("backspace deletes a whole surrogate pair", async () => {
    const session = await startReplSession();
    await session.input(`"a\u{1F44D}${KEYS.backspace}"${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "a👍"a"
      "a"
      > 
      ",
      }
    `);
  });

  test("one arrow press steps over a whole surrogate pair", async () => {
    const session = await startReplSession();
    await session.input(`"\u{1F44D}"${KEYS.left}${KEYS.left}X${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> "👍"X👍"
      "X👍"
      > 
      ",
      }
    `);
  });
});

describe("repl history", () => {
  test("accepted lines are appended to the history file", async () => {
    const configDir = tempConfigDir("history-write");
    const session = await startReplSession([], { configDir });
    await session.line("111");
    await session.line("222");
    await session.exit();
    expect(fs.readFileSync(historyFilePath(configDir), "utf-8"))
      .toMatchInlineSnapshot(`
        "111
        222
        "
      `);
  });

  test("consecutive duplicate lines are only recorded once", async () => {
    const configDir = tempConfigDir("history-dedupe");
    const session = await startReplSession([], { configDir });
    await session.line("111");
    await session.line("111");
    await session.line("222");
    await session.line("111");
    await session.exit();
    expect(fs.readFileSync(historyFilePath(configDir), "utf-8"))
      .toMatchInlineSnapshot(`
        "111
        222
        111
        "
      `);
  });

  test("empty lines are not recorded", async () => {
    const configDir = tempConfigDir("history-empty");
    const session = await startReplSession([], { configDir });
    await session.line("");
    await session.line("111");
    await session.line("");
    await session.exit();
    expect(fs.readFileSync(historyFilePath(configDir), "utf-8"))
      .toMatchInlineSnapshot(`
        "111
        "
      `);
  });

  test("up and down navigate history within a session", async () => {
    const configDir = tempConfigDir("history-arrows");
    const session = await startReplSession([], { configDir });
    await session.line("111");
    await session.line("222");
    await session.input(`${KEYS.up}${KEYS.up}${KEYS.down}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 111
      111
      > 222
      222
      > 222111222
      222
      > 
      ",
      }
    `);
  });

  test("^P and ^N navigate history like up and down", async () => {
    const configDir = tempConfigDir("history-ctrl-pn");
    const session = await startReplSession([], { configDir });
    await session.line("111");
    await session.line("222");
    await session.input(`${KEYS.ctrlP}${KEYS.ctrlP}${KEYS.ctrlN}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 111
      111
      > 222
      222
      > 222111222
      222
      > 
      ",
      }
    `);
  });

  test("a later session loads the history file written by an earlier one", async () => {
    const configDir = tempConfigDir("history-reload");

    const first = await startReplSession([], { configDir });
    await first.line("111");
    await first.line("222");
    await first.exit();

    const second = await startReplSession([], { configDir });
    await second.input(`${KEYS.up}${KEYS.up}${KEYS.enter}`);
    await second.exit();
    expect(second.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 222111
      111
      > 
      ",
      }
    `);
  });

  test("page up and page down search history by prefix", async () => {
    const configDir = tempConfigDir("history-search");
    const session = await startReplSession([], { configDir });
    await session.line("100 + 1");
    await session.line("200 + 2");
    await session.line("100 + 3");
    // type "100" then search backwards for a history entry with that prefix
    await session.input(`100${KEYS.pageUp}${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 100 + 1
      101
      > 200 + 2
      202
      > 100 + 3
      103
      > 100 + 3
      103
      > 
      ",
      }
    `);
  });
});

describe("repl completion", () => {
  test("tab completes the longest common prefix", async () => {
    const session = await startReplSession();
    // candidates are acos and acosh, so the shared "s" is filled in
    await session.input(`Math.aco${KEYS.tab}(1)${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> Math.acos(1)
      0
      > 
      ",
      }
    `);
  });

  test("tab twice lists the candidates in columns", async () => {
    const session = await startReplSession();
    await session.input(`Math.a${KEYS.tab}${KEYS.tab}`, "acosh");
    session.send(KEYS.ctrlX);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> Math.a
      abs    acos   acosh  asin   asinh  atan   atan2  atanh  
      > Math.a
      ",
      }
    `);
  });

  test("tab twice on a single function candidate appends an open paren", async () => {
    const session = await startReplSession();
    await session.input(`JSON.pars${KEYS.tab}${KEYS.tab}"1")${KEYS.enter}`);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> JSON.parse("1")
      1
      > 
      ",
      }
    `);
  });

  // getContextObject evals the identifier before the dot to find something to
  // complete against. It lives in its own module so that eval resolves against
  // globals only. Back when it sat inside the repl's closure, the repl's own
  // locals (mexpr, clipBoard, cmd, and so on) were completable at the prompt.
  test("the repl's own internals are not completable", async () => {
    const session = await startReplSession();
    // clear the line and accept a blank one, so there is a prompt to wait for
    await session.input(
      `mexpr.${KEYS.tab}${KEYS.tab}${KEYS.ctrlX}${KEYS.enter}`,
    );
    await session.exit();
    // String.prototype members would show up if `mexpr` resolved to the
    // internal string it names
    expect(session.result().stdout).not.toContain("toLowerCase");
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> mexpr.
      > 
      ",
      }
    `);
  });

  test("completing an undefined name does not print an error", async () => {
    const session = await startReplSession();
    // clear the line and accept a blank one, so there is a prompt to wait for
    await session.input(
      `noSuchGlobal.${KEYS.tab}${KEYS.tab}${KEYS.ctrlX}${KEYS.enter}`,
    );
    await session.exit();
    expect(session.result().stdout).not.toContain("ReferenceError");
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> noSuchGlobal.
      > 
      ",
      }
    `);
  });

  test("global completions omit the error-throwing command stubs", async () => {
    const session = await startReplSession();
    await session.input(`c${KEYS.tab}${KEYS.tab}`, "console");
    session.send(KEYS.ctrlX);
    await session.exit();

    const listing = session.result().stdout;
    // real globals are offered
    expect(listing).toContain("cat");
    expect(listing).toContain("copy");
    // _stubs entries, which only exist to throw "did you mean" errors, are not
    expect(listing).not.toMatch(/\bcp\b/);
    expect(listing).not.toMatch(/\bcwd\b/);
    expect(listing).toMatchInlineSnapshot(`
      "> c
      cat            chmod          clearInterval  console        copy
      cd             clear          clearTimeout   constructor    cyan
      > c
      "
    `);
  });
});

describe("repl ctrl-c", () => {
  test("one ctrl-c warns and keeps what was typed", async () => {
    const session = await startReplSession();
    await session.input(`1 + 1${KEYS.ctrlC}`, "Press Ctrl-C again");
    // the line survives, so pressing Enter still evaluates it
    await session.input(KEYS.enter);
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 1 + 1
      (Press Ctrl-C again to quit)
      > 1 + 1
      2
      > 
      ",
      }
    `);
  });

  test("two ctrl-c presses in a row exit", async () => {
    const session = await startReplSession();
    session.send(KEYS.ctrlC, KEYS.ctrlC);
    await session.finish();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 
      (Press Ctrl-C again to quit)
      > 
      ",
      }
    `);
  });

  test("a real SIGINT behaves like the ctrl-c byte", async () => {
    const session = await startReplSession();
    session.run.kill("SIGINT");
    await session.waitFor("Press Ctrl-C again");
    session.run.kill("SIGINT");
    await session.finish();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 
      (Press Ctrl-C again to quit)
      > 
      ",
      }
    `);
  });

  // Pressing Enter is a command in its own right, so it clears the "one ctrl-c
  // has already been pressed" state and the warning starts over.
  test("Enter between two ctrl-c presses resets the warning", async () => {
    const session = await startReplSession();
    await session.input(KEYS.ctrlC, "Press Ctrl-C again");
    await session.input(KEYS.enter);
    await session.input(KEYS.ctrlC, "Press Ctrl-C again");
    session.send(KEYS.ctrlC);
    await session.finish();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> 
      (Press Ctrl-C again to quit)
      > 
      > 
      (Press Ctrl-C again to quit)
      > 
      ",
      }
    `);
  });

  // Completion has the same "was the previous command also me?" logic, so it
  // is affected by the same staleness: a tab pressed on the fresh line after
  // Enter used to count as the *second* tab of the previous line and dump the
  // whole global listing.
  test("a tab on the line after a tab does not count as a repeat", async () => {
    const session = await startReplSession();
    await session.input(`Math.a${KEYS.tab}${KEYS.enter}`);
    await session.input(`${KEYS.tab}${KEYS.enter}`);
    await session.exit();
    // a global that only shows up if the whole global listing got printed
    expect(session.result().stdout).not.toContain("InteractivePrompt");
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> Math.a
      undefined
      > 
      > 
      ",
      }
    `);
  });
});

describe("repl langs", () => {
  test("--lang ts compiles typescript and echoes the result", async () => {
    const session = await startReplSession(["--lang", "ts"]);
    await session.line("(5 as number) + 1");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> (5 as number) + 1
      -> (5 ) + 1
      6
      > 
      ",
      }
    `);
  });

  test("--lang coffee compiles coffeescript", async () => {
    const session = await startReplSession(["--lang", "coffee"]);
    await session.line("x = 5");
    await session.line("x * 2");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> x = 5
      -> var x; x = 5; 
      5
      > x * 2
      -> x * 2; 
      10
      > 
      ",
      }
    `);
  });

  // Everything typed at the prompt is compiled with `{ expression: true }`, so
  // civet's statement forms (`x := 5`, `if ... then ...`) are syntax errors
  // here; only expressions work.
  test("--lang civet compiles civet expressions", async () => {
    const session = await startReplSession(["--lang", "civet"]);
    await session.line("[1, 2, 3].map (x) => x * 2");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> [1, 2, 3].map (x) => x * 2
      -> [1, 2, 3].map((x) => x * 2)
      [
        2
        4
        6
      ]
      > 
      ",
      }
    `);
  });

  test("--lang jsx compiles a jsx element typed on one line", async () => {
    const session = await startReplSession(["--lang", "jsx"]);
    await session.line("<div>hi</div>");
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> <div>hi</div>
      -> JSX.createElement('div', null, "hi")
      {
        $$typeof: Symbol(JSX.Element)
        type: "div"
        props: {
          children: [
            "hi"
          ]
        }
        key: null
      }
      > 
      ",
      }
    `);
  });

  // The colorizer doubles as the parser, and a `<` in expression position is
  // the start of a tag to it everywhere but here, where it has to stay an
  // angle-bracket assertion, or the line would never look finished.
  test("--lang ts reads <Type>value as an assertion, not as a tag", async () => {
    const session = await startReplSession(["--lang", "ts"]);
    await session.line('<string>"hi"');
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> <string>"hi"
      -> "hi"
      "hi"
      > 
      ",
      }
    `);
  });

  test("import statements are rewritten to require calls", async () => {
    const session = await startReplSession();
    await session.line('import { basename } from "quickjs:os"');
    await session.exit();
    expect(session.result()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": null,
        "stderr": "",
        "stdout": "> import { basename } from "quickjs:os"
      -> ({ basename } = require("quickjs:os")); basename
      undefined
      > 
      ",
      }
    `);
  });

  test("an invalid --lang is rejected", async () => {
    expect(await runYavascript(["--lang", "nope"])).toMatchInlineSnapshot(`
      {
        "code": 3,
        "error": null,
        "stderr": "Invalid --lang: "nope".
      Valid values for --lang are js, javascript, ts, typescript, jsx, tsx, coffee, coffeescript or civet.

      For more info, run '<yavascript binary> --help'.
      ",
        "stdout": "",
      }
    `);
  });
});

describe("repl colors", () => {
  test("colors are off when CLICOLOR=0", async () => {
    const session = await startReplSession();
    await session.line("const x = 1");
    await session.exit();
    // no SGR sequences at all
    expect(session.raw().stdout).not.toMatch(/\x1b\[\d+(;\d+)*m/);
  });

  test("colors are on when CLICOLOR_FORCE=1", async () => {
    const session = await startReplSession([], { colors: true });
    await session.line("const x = 1");
    await session.exit();

    const raw = session.raw().stdout;
    expect(raw).toContain("\x1b[34;1m"); // bright_blue: keyword
    expect(raw).toContain("\x1b[35;1m"); // bright_magenta: number
  });

  test("jsx tags get their own color", async () => {
    const session = await startReplSession(["--lang", "jsx"], { colors: true });
    await session.line("<div>hi</div>");
    await session.exit();

    expect(session.raw().stdout).toContain("\x1b[36;1m"); // bright_cyan: jsx tag
  });
});
