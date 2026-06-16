import { LANGS } from "../../langs";
import { NOTHING } from "./special";
import * as modifiedQjsRepl from "./modified-qjs-repl";

const validLangs = Array.from(LANGS);

// TODO merge with InteractivePrompt in a sensible way
function startRepl(
  context: { [key: string]: any } = {},
  lang: string = "javascript",
) {
  if (!LANGS.has(lang)) {
    throw new Error(
      `Invalid lang: '${lang}'. Valid langs are: ${validLangs
        .slice(0, -1)
        .join(", ")} or ${validLangs[validLangs.length - 1]}`,
    );
  }

  // TODO create actual QuickJS context and run stuff inside it
  Object.assign(globalThis, context);
  modifiedQjsRepl.startRepl(lang);
}

Object.assign(startRepl, { NOTHING });

export { startRepl };
