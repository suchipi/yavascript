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
