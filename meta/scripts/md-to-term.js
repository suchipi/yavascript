#!/usr/bin/env node
// force chalk (which marked-terminal uses) to always output in color
process.env.FORCE_COLOR = 3;

const fs = require("fs");
const child_process = require("child_process");
const clefairy = require("clefairy");
const tmp = require("tmp");
const chalk = require("chalk");
const { marked } = require("marked");
const wrapAnsi = require("wrap-ansi");

const PRINT_WIDTH = 100;

clefairy.run(
  {
    input: clefairy.requiredPath,
    output: clefairy.optionalPath,
  },
  async function main({ input, output }) {
    const TerminalRenderer = require("@suchipi/marked-terminal");

    const highlightersProxy = new Proxy(
      {},
      {
        get(target, propertyKey, receiver) {
          if (!propertyKey) {
            return undefined;
          }

          return function syntaxHighlight(code) {
            const lang = propertyKey;
            return (
              chalk.gray("```" + lang) +
              "\n" +
              printWithBat(code, lang) +
              "\n" +
              chalk.gray("```")
            );
          };
        },
      }
    );

    const nbsp = "\xA0";

    marked.setOptions({
      renderer: new TerminalRenderer({
        codespan: (code) =>
          chalk.bgHex("#eeeeee").hex("#a81488")(nbsp + code + nbsp),
        code: (code) => code,
        blockquote: (content) => {
          const blockquoteBorder = "┃ ";
          const wrapped = wrapAnsi(content, PRINT_WIDTH, { hard: true });
          const lines = wrapped.split("\n");
          const withBorder = lines
            .map((line) => blockquoteBorder + line)
            .join("\n");
          return chalk.yellow(withBorder);
        },

        paragraph: (content) => wrapAnsi(content, PRINT_WIDTH),
        listitem: (content) => wrapAnsi(content, PRINT_WIDTH - 4),

        // This returns an empty string in order to omit HTML comments, which
        // *should* be the only HTML appearing in our markdown docs.
        html: (content) => "",

        showSectionPrefix: true,
        syntaxHighlighters: highlightersProxy,
        width: PRINT_WIDTH,
        tab: 2,
      }),
      mangle: false,
      headerIds: false,
    });

    const content = fs.readFileSync(input, "utf-8");

    const rendered = marked(content);

    if (output) {
      fs.writeFileSync(output, rendered, "utf-8");
    } else {
      console.log(rendered);
    }
  }
);

function printWithBat(content, lang) {
  const tmpFile = tmp.fileSync();
  fs.writeFileSync(tmpFile.fd, content, { encoding: "utf-8" });
  fs.closeSync(tmpFile.fd);

  const stdout = child_process.execSync(
    `cat ${JSON.stringify(
      tmpFile.name
    )} | bat --force-colorization --style plain --language ${lang} --terminal-width ${PRINT_WIDTH}`,
    { encoding: "utf-8" }
  );
  return stdout;
}
