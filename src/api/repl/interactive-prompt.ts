import { assert } from "../assert";
import { types } from "../types";
import { startRepl } from "./generic-repl-new";
import { HistoryFile } from "./history-file";

export class InteractivePrompt {
  handleInput: (input: string) => void;

  prompt?: () => string;
  historyFileName?: string;

  constructor(
    handleInput: (input: string) => void,
    options: {
      prompt?: () => string;
      historyFileName?: string;
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
      options.historyFileName,
      types.or(types.undefined, types.string),
      "when present, 'options.historyFileName' must be a string"
    );

    this.handleInput = handleInput;
    Object.assign(this, options);
  }

  start() {
    let historyFile: HistoryFile | null = null;
    if (this.historyFileName) {
      historyFile = new HistoryFile(this.historyFileName);
    }

    startRepl({
      handleInput: this.handleInput,
      printPrompt: this.prompt,
      historyFile,
    });
  }
}
