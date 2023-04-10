// TODO: could make this API public, for color styles at least

export class Template {
  startDelim: string;
  endDelim: string;
  functions: { [key: string]: (str: string) => string };
  #functionNames: Set<string>;

  constructor(
    startDelim: string,
    endDelim: string,
    functions: { [key: string]: (str: string) => string }
  ) {
    this.startDelim = startDelim;
    this.endDelim = endDelim;
    this.functions = functions;
    this.#functionNames = new Set(Object.keys(functions));
  }

  lex(input: string): Array<string> {
    const tokens: Array<string> = [];
    let current = "";

    for (const char of input) {
      if (char === this.startDelim) {
        const matches = current.match(/(\w+)$/);
        if (matches) {
          const verb = matches[1];
          if (this.#functionNames.has(verb)) {
            const beforeVerb = current.slice(0, -verb.length);
            if (beforeVerb.length > 0) {
              tokens.push(beforeVerb);
            }
            tokens.push(verb);
            current = "";
            tokens.push(this.startDelim);
          } else {
            current += char;
          }
        } else {
          current += char;
        }
      } else if (char === this.endDelim) {
        if (current.length > 0) {
          tokens.push(current);
        }
        current = "";
        tokens.push(char);
      } else {
        current += char;
      }
    }
    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  parse(
    tokens: Array<string>
  ): Array<{ transforms: Array<string>; content: string }> {
    const state: Array<string> = [];
    const output: Array<{ transforms: Array<string>; content: string }> = [];

    const tokensLength = tokens.length;
    for (let i = 0; i < tokensLength; i++) {
      let token = tokens[i];
      let lookahead = tokens[i + 1] || null;
      if (this.#functionNames.has(token) && lookahead === this.startDelim) {
        state.push(token);
        // eat startDelim
        i++;
      } else if (token === this.endDelim && state.length > 0) {
        state.pop();
      } else {
        output.push({ transforms: state.slice(), content: token });
      }
    }

    return output;
  }

  transform(input: string): string {
    const tokens = this.lex(input);
    const chunks = this.parse(tokens);

    return chunks
      .map((chunk) => {
        return chunk.transforms.reduce((content, transformName) => {
          return this.functions[transformName](content);
        }, chunk.content);
      })
      .join("");
  }
}
