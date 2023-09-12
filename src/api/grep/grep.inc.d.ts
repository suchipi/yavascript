/** Split `str` on newline and then return lines matching `pattern`. */
declare const grepString: {
  /** Split `str` on newline and then return lines matching `pattern`. */
  (str: string, pattern: string | RegExp): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true }
  ): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { details: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false; details: false }
  ): Array<string>;

  /** Split `str` on newline and then return lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true; details: false }
  ): Array<string>;

  /** Split `str` on newline and then return info about lines matching `pattern`. */
  (str: string, pattern: string | RegExp, options: { details: true }): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;

  /** Split `str` on newline and then return info about lines matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: false; details: true }
  ): Array<string>;

  /** Split `str` on newline and then return info about lines NOT matching `pattern`. */
  (
    str: string,
    pattern: string | RegExp,
    options: { inverse: true; details: true }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
};

/** Read the content at `path`, split it on newline, and then return lines matching `pattern`. */
declare const grepFile: {
  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (path: string | Path, pattern: string | RegExp): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines NOT matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: true }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: false; details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return lines NOT matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: true; details: false }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return info about lines matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { details: true }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;

  /** Read the content at `path`, split it on newline,  and then return info about lines matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: false; details: true }
  ): Array<string>;

  /** Read the content at `path`, split it on newline,  and then return info about lines NOT matching `pattern`. */
  (
    path: string | Path,
    pattern: string | RegExp,
    options: { inverse: true; details: true }
  ): Array<{
    lineNumber: number;
    lineContent: string;
    matches: RegExpMatchArray;
  }>;
};

interface String {
  // Same as grepString but without the first argument.
  grep: {
    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp, options: { inverse: false }): Array<string>;

    /** Split the string on newline and then return lines NOT matching `pattern`. */
    (pattern: string | RegExp, options: { inverse: true }): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (pattern: string | RegExp, options: { details: false }): Array<string>;

    /** Split the string on newline and then return lines matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: false; details: false }
    ): Array<string>;

    /** Split the string on newline and then return lines NOT matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: true; details: false }
    ): Array<string>;

    /** Split the string on newline and then return info about lines matching `pattern`. */
    (pattern: string | RegExp, options: { details: true }): Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;

    /** Split the string on newline and then return info about lines matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: false; details: true }
    ): Array<string>;

    /** Split the string on newline and then return info about lines NOT matching `pattern`. */
    (
      pattern: string | RegExp,
      options: { inverse: true; details: true }
    ): Array<{
      lineNumber: number;
      lineContent: string;
      matches: RegExpMatchArray;
    }>;
  };
}
