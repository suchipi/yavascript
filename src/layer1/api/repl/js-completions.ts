import { isWord } from "./text-utils";
import _stubs from "../commands/_stubs";

/*
 * Captured up front so that redefining these at the prompt can't break
 * completion. They can't be named `Object`/`String`: the bundler's module
 * prelude uses the real globals before this point, and a module-scoped const of
 * the same name would put that access in the temporal dead zone.
 */
const SafeObject = globalThis.Object;
const SafeString = globalThis.String;

/** These only exist to throw "did you mean ...?", so don't offer them. */
const globalStubsToNotAutocomplete = new Set(SafeObject.keys(_stubs));

/** The word ending at `wordEnd`, read backwards. */
function getContextWord(line: string, wordEnd: number) {
  let word = "";
  let index = wordEnd;
  while (index > 0 && isWord(line[index - 1])) {
    index--;
    word = line[index] + word;
  }
  return word;
}

/**
 * Evaluate a bare identifier or literal to get something to complete against.
 * Anything the user has half-typed can land here, so a name that doesn't
 * resolve is an expected outcome, not an error worth propagating: letting it
 * escape would print a stack trace over the line being edited.
 */
function evalForCompletion(source: string): any {
  try {
    return eval(source);
  } catch {
    return undefined;
  }
}

/**
 * Work out what object the user is completing a property of, by reading
 * backwards from `segmentStart`. Returns `globalThis` at the start of an expression, a
 * stand-in value for a literal (`"a"` for a string, `[]` for an array, ...), or
 * undefined when there's nothing to complete against.
 */
function getContextObject(line: string, segmentStart: number): any {
  let obj: any;
  let base: string;
  let char: string;
  if (
    segmentStart <= 0 ||
    " ~!%^&*(-+={[|:;,<>?/".indexOf(line[segmentStart - 1]) >= 0
  ) {
    return globalThis;
  }

  if (segmentStart >= 2 && line[segmentStart - 1] === ".") {
    // everything below reads backwards from the dot this segment hangs off
    const dotIndex = segmentStart - 1;
    obj = {};
    switch ((char = line[dotIndex - 1])) {
      case "'":
      case '"':
        return "a";
      case "]":
        return [];
      case "}":
        return {};
      case "/":
        return / /;
      default:
        if (isWord(char)) {
          base = getContextWord(line, dotIndex);
          if (
            ["true", "false", "null", "this"].includes(base) ||
            !isNaN(+base)
          ) {
            return evalForCompletion(base);
          }
          obj = getContextObject(line, dotIndex - base.length);
          if (obj === null || obj === void 0) {
            return obj;
          }
          if (obj === globalThis && obj[base] === void 0) {
            return evalForCompletion(base);
          } else {
            return obj[base];
          }
        }
        return {};
    }
  }
  return void 0;
}

/* sort with internal (underscore-prefixed) names last */
function symbolCompare(left: string, right: string) {
  if (left[0] != right[0]) {
    if (left[0] == "_") {
      return 1;
    }
    if (right[0] == "_") {
      return -1;
    }
  }
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return +1;
  }
  return 0;
}

export type JsCompletions = {
  /** The candidate completions, sorted and deduplicated. */
  candidates: Array<string>;
  /** How much of the candidate the user has already typed. */
  prefixLength: number;
};

export function getCompletions(
  line: string,
  cursorIndex: number,
): JsCompletions {
  let obj: any;
  let jdx: number;

  const prefix = getContextWord(line, cursorIndex);
  const contextObject = getContextObject(line, cursorIndex - prefix.length);
  const results: string[] = [];
  // enumerate properties from object and its prototype chain,
  // add non-numeric regular properties with prefix as a prefix
  obj = contextObject;
  for (let idx = 0; idx < 10 && obj !== null && obj !== void 0; idx++) {
    const props = SafeObject.getOwnPropertyNames(obj);
    /* add non-numeric regular properties */
    for (const prop of props) {
      if (
        typeof prop == "string" &&
        SafeString(Number(prop)) != prop &&
        prop.startsWith(prefix)
      ) {
        if (obj === globalThis) {
          if (!globalStubsToNotAutocomplete.has(prop)) {
            results.push(prop);
          }
        } else {
          results.push(prop);
        }
      }
    }
    obj = SafeObject.getPrototypeOf(obj);
  }
  if (results.length > 1) {
    results.sort(symbolCompare);
    for (let idx = (jdx = 1); idx < results.length; idx++) {
      if (results[idx] != results[idx - 1]) {
        results[jdx++] = results[idx];
      }
    }
    results.length = jdx;
  }
  // The name is already fully typed, so there is nothing left to complete;
  // offer the tail instead. prefixLength 0 says none of it is on the line yet.
  if (results.length === 1 && results[0] === prefix) {
    const suffix = suffixForCandidate(results[0], contextObject);
    if (suffix !== "") {
      return { candidates: [suffix], prefixLength: 0 };
    }
  }

  return { candidates: results, prefixLength: prefix.length };
}

/**
 * What to tack on when Tab is pressed twice against a single unambiguous
 * candidate: parens for a function, a dot for an object.
 */
function suffixForCandidate(candidate: string, context: any): string {
  const member = context?.[candidate];
  if (typeof member === "function") {
    return member.length === 0 ? "()" : "(";
  }
  if (typeof member === "object") {
    return ".";
  }
  return "";
}
