export function isAlpha(char: string) {
  return (
    typeof char === "string" &&
    ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z"))
  );
}

export function isDigit(char: string) {
  return typeof char === "string" && char >= "0" && char <= "9";
}

export function isWord(char: string) {
  return (
    typeof char === "string" &&
    (isAlpha(char) || isDigit(char) || char == "_" || char == "$")
  );
}

/**
 * The number of characters `str` occupies on screen, counting a surrogate pair
 * as one.
 *
 * The trailing surrogate is never counted, which gives the property
 * `ucsLength(str) === ucsLength(str.substring(0, a)) + ucsLength(str.substring(a, str.length))`
 * for `0 <= a <= str.length`.
 */
export function ucsLength(str: string) {
  let length = 0;
  const strLen = str.length;
  for (let idx = 0; idx < strLen; idx++) {
    const charCode = str.charCodeAt(idx);
    if (charCode < 0xdc00 || charCode >= 0xe000) {
      length++;
    }
  }
  return length;
}

export function isTrailingSurrogate(char: string) {
  if (typeof char !== "string") {
    return false;
  }
  const codePoint = char.codePointAt(0);
  return codePoint != null && codePoint >= 0xdc00 && codePoint < 0xe000;
}
