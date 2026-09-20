interface RegExpConstructor {
  /**
   * The function `RegExp.escape` accepts an input string and escapes those
   * characters in it which would otherwise have a special meaning when
   * appearing in a regular expression.
   *
   * Throws a TypeError if `str` isn't a string.
   */
  escape(str: string): string;
}
