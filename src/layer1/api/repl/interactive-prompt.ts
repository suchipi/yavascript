import { assert } from "../assert";
import { types } from "../types";
import { startReplEngine, ReplCompletions } from "./repl-engine";
import { HistoryFile } from "./history-file";

export class InteractivePrompt {
  handleInput: (input: string) => void;

  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (line: string, cursorIndex: number) => ReplCompletions;

  constructor(
    handleInput: (input: string) => void,
    options: {
      prompt?: () => string;
      printInput?: (input: string) => void;
      historyFileName?: string;
      getCompletions?: (line: string, cursorIndex: number) => ReplCompletions;
    } = {},
  ) {
    assert.type(
      handleInput,
      types.Function,
      "'handleInput' must be a function",
    );
    assert.type(
      options,
      types.or(types.undefined, types.Object),
      "when present, 'options' must be an object",
    );
    assert.type(
      options.prompt,
      types.or(types.undefined, types.Function),
      "when present, 'options.prompt' must be a function",
    );
    assert.type(
      options.printInput,
      types.or(types.undefined, types.Function),
      "when present, 'options.printInput' must be a function",
    );
    assert.type(
      options.historyFileName,
      types.or(types.undefined, types.string),
      "when present, 'options.historyFileName' must be a string",
    );
    assert.type(
      options.getCompletions,
      types.or(types.undefined, types.Function),
      "when present, 'options.getCompletions' must be a function",
    );

    this.handleInput = handleInput;
    Object.assign(this, options);
  }

  start() {
    let historyFile: HistoryFile | null = null;
    if (this.historyFileName) {
      historyFile = new HistoryFile(this.historyFileName);
    }

    const printInput = this.printInput;

    startReplEngine({
      handleInput: this.handleInput,
      historyFile,
      getPrompt: this.prompt,
      getCompletions: this.getCompletions,
      // The engine's incremental echo can't run a custom painter, so adapt
      // rather than forward: supplying printInput is what makes it repaint.
      printInput: printInput ? (line) => printInput(line) : undefined,
    });
  }
}
