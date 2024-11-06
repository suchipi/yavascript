import * as std from "quickjs:std";
import type { HistoryFile } from "./history-file";

const defaultPrintPrompt = () => {
  std.out.puts("> ");
};

export function startRepl({
  handleInput,
  printPrompt = defaultPrintPrompt,
  historyFile = null,
}: {
  handleInput: (input: string) => boolean | void;
  printPrompt?: () => void;
  historyFile?: HistoryFile | undefined | null;
}) {
  while (true) {
    printPrompt();
    const line = std.in.getline();
    if (line == null) {
      break;
    }
    const shouldExit = handleInput(line);
    if (shouldExit) {
      break;
    }
  }
}
