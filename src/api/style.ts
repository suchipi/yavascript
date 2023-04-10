// import {
//   bgBlack,
//   bgBlue,
//   bgCyan,
//   bgGreen,
//   bgMagenta,
//   bgRed,
//   bgWhite,
//   bgYellow,
//   black,
//   blue,
//   bold,
//   cyan,
//   dim,
//   gray,
//   green,
//   grey,
//   hidden,
//   inverse,
//   italic,
//   magenta,
//   red,
//   reset,
//   strikethrough,
//   underline,
//   white,
//   yellow,
// } from "./strings";

// const defaultFunctions = {
//   bgBlack,
//   bgBlue,
//   bgCyan,
//   bgGreen,
//   bgMagenta,
//   bgRed,
//   bgWhite,
//   bgYellow,
//   black,
//   blue,
//   bold,
//   cyan,
//   dim,
//   gray,
//   green,
//   grey,
//   hidden,
//   inverse,
//   italic,
//   magenta,
//   red,
//   reset,
//   strikethrough,
//   underline,
//   white,
//   yellow,
// };

export function makeTransform(startDelim: string, endDelim: string) {
  function lex(input: string): Array<string> {
    const tokens: Array<string> = [];
    let current = "";

    function appendToChunk(part: string) {
      current += part;
    }

    function finishChunk() {
      if (current.length > 0) {
        tokens.push(current);
      }
      current = "";
    }

    for (const char of input) {
      if (char === startDelim || char === endDelim) {
        finishChunk();
        appendToChunk(char);
        finishChunk();
      } else if (/\s/.test(char)) {
        finishChunk();
        appendToChunk(char);
        finishChunk();
      } else {
        appendToChunk(char);
      }
    }
    finishChunk();

    return tokens;
  }

  function parse(
    tokens: Array<string>,
    functionNames: Set<string>
  ): Array<{ transforms: Array<string>; content: string }> {
    const state: Array<string> = [];
    const output: Array<{ transforms: Array<string>; content: string }> = [];

    const tokensLength = tokens.length;
    for (let i = 0; i < tokensLength; i++) {
      let token = tokens[i];
      let lookahead = tokens[i + 1] || null;
      if (functionNames.has(token) && lookahead === startDelim) {
        state.push(token);
      } else if (token === endDelim) {
        state.pop();
      } else {
        output.push({ transforms: state.slice(), content: token });
      }
    }

    return output;
  }

  function transform(
    input: string,
    functions: { [key: string]: (str: string) => string }
  ): string {
    const tokens = lex(input);
    const chunks = parse(tokens, new Set(Object.keys(functions)));

    return chunks
      .map((chunk) => {
        return chunk.transforms.reduce((content, transformName) => {
          return functions[transformName](content);
        }, chunk.content);
      })
      .join("");
  }

  return transform;
}

// const FORMATTED_SECTION_REGEX = /((?:\w|\.)+)「([^」]*?)」/g;

// export function style(
//   input: string,
//   functions: { [key: string]: (str: string) => string } = defaultFunctions
// ): string {
//   return input.replace(
//     FORMATTED_SECTION_REGEX,
//     (match: string, fnNames: string, content: string) => {
//       let value = content;
//       for (const fnName of fnNames.split(".")) {
//         if (Object.hasOwn(functions, fnName)) {
//           value = functions[fnName](value);
//         } else {
//           return match;
//         }
//       }

//       return value;
//     }
//   );
// }
