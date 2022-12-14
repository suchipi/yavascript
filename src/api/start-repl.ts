import replTarget from "../targets/repl";
import { LANGS } from "../langs";

const validLangs = Array.from(LANGS);

export function startRepl(
  context: { [key: string]: any } = {},
  lang: string = "javascript"
) {
  if (!LANGS.has(lang)) {
    throw new Error(
      `Invalid lang: '${lang}'. Valid langs are: ${validLangs
        .slice(0, -1)
        .join(", ")} or ${validLangs[validLangs.length - 1]}`
    );
  }

  Object.assign(globalThis, context);
  replTarget(lang);
}
