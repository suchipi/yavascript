export const LANGS = new Set([
  "js",
  "javascript",
  "ts",
  "typescript",
  "jsx",
  "tsx",
  "coffee",
  "coffeescript",
  "civet",
]);

/**
 * Whether `lang` has TypeScript's `<Type>value` assertion, which is the one `<`
 * in expression position that isn't the start of a JSX tag.
 */
export function langHasAngleBracketAssertions(lang: string) {
  return lang === "ts" || lang === "typescript";
}

export function langToCompiler(lang: string) {
  const compilers: typeof import("./compilers").default =
    require("./compilers").default;

  switch (lang) {
    case "js":
    case "javascript": {
      return compilers.js;
    }
    case "ts":
    case "typescript": {
      return compilers.ts;
    }
    case "jsx": {
      return compilers.jsx;
    }
    case "tsx": {
      return compilers.tsx;
    }
    case "coffee":
    case "coffeescript": {
      return compilers.coffee;
    }
    case "civet":
      return compilers.civet;
    default: {
      throw new Error(`No compiler for lang: ${lang}`);
    }
  }
}
