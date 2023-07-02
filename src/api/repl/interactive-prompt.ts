import { assert } from "../assert";
import { types } from "../types";
import { startRepl } from "./generic-repl";
import { HistoryFile } from "./history-file";

export class InteractivePrompt {
  handleInput: (input: string) => void;

  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (
    line: string,
    pos: number
  ) => {
    // TODO refactor these to have better key names
    tab: Array<string>;
    pos: number;
    ctx: { [key: string | number | symbol]: any };
  };

  constructor(
    handleInput: (input: string) => void,
    options: {
      prompt?: () => string;
      printInput?: (input: string) => void;
      historyFileName?: string;
      getCompletions?: (
        line: string,
        pos: number
      ) => {
        // TODO refactor these to have better key names
        tab: Array<string>;
        pos: number;
        ctx: { [key: string | number | symbol]: any };
      };
    } = {}
  ) {
    assert.type(
      handleInput,
      types.Function,
      "'handleInput' must be a function"
    );
    assert.type(
      options,
      types.or(types.undefined, types.Object),
      "when present, 'options' must be an object"
    );
    assert.type(
      options.prompt,
      types.or(types.undefined, types.Function),
      "when present, 'options.prompt' must be a function"
    );
    assert.type(
      options.printInput,
      types.or(types.undefined, types.Function),
      "when present, 'options.printInput' must be a function"
    );
    assert.type(
      options.historyFileName,
      types.or(types.undefined, types.string),
      "when present, 'options.historyFileName' must be a string"
    );
    assert.type(
      options.getCompletions,
      types.or(types.undefined, types.Function),
      "when present, 'options.getCompletions' must be a function"
    );

    this.handleInput = handleInput;
    Object.assign(this, options);
  }

  start() {
    let historyFile: HistoryFile | null = null;
    if (this.historyFileName) {
      historyFile = new HistoryFile(this.historyFileName);
    }

    startRepl(this.handleInput, {
      print_cmd: this.printInput,
      get_completions: this.getCompletions,
      history_file: historyFile,
      get_prompt: this.prompt,
    });
  }
}
