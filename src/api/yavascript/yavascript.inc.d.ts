/** Info about the currently-running yavascript binary */
declare const yavascript: {
  /**
   * The version of the currently-running yavascript binary.
   *
   * Will be something formatted like one of these:
   * - "v0.0.7"
   * - "v0.1.3-alpha"
   * - "git-286a3a336849"
   * - "git-286a3a336849-dirty"
   *
   * Or, more formally: either a "V" version string or a "GIT" version string:
   * - "V" version strings start with the character 'v', followed by a semver
   *   version string, optionally followed by the character '-' and any
   *   arbitrary content afterwards.
   * - "GIT" version strings start with the prefix "git-", followed by the
   *   first 12 digits of a git commit SHA, optionally followed by the
   *   character '-' and any arbitrary content afterwards.
   */
  version: string;

  /** The processor architecture we're running on. */
  arch: "x86_64" | "arm64";

  /**
   * The version of the ecma262 standard supported by the currently-running yavascript binary.
   *
   * Will always be in the format "ES" + a year. Is never lower than ES2020.
   */
  ecmaVersion: string;

  /** The compilers yavascript uses internally to load files. */
  compilers: {
    js(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    tsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    ts(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    jsx(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    coffee(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    civet(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;

    autodetect(
      code: string,
      options?: { filename?: string; expression?: boolean }
    ): string;
  };
};
