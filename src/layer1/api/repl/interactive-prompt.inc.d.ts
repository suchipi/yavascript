/**
 * Reads lines from the user one at a time, with readline-style editing keys,
 * history recall and Tab completion.
 *
 * ```ts
 * const prompt = new InteractivePrompt(
 *   (input) => {
 *     console.log("you typed:", input);
 *   },
 *   { prompt: () => "say something> " },
 * );
 * prompt.start();
 * ```
 *
 * The keys it binds, none of which you have to set up yourself:
 *
 * Moving about:
 *
 * - Left and Right, or Ctrl+B and Ctrl+F, move by one character
 * - Ctrl+Left and Ctrl+Right, or Alt+B and Alt+F, move by one word
 * - Home or Ctrl+A goes to the start of the line, End or Ctrl+E to the end
 *
 * Deleting:
 *
 * - Backspace, or Ctrl+H, deletes the character before the cursor
 * - Delete, or Ctrl+D with something typed, deletes the one under it
 * - Ctrl+W or Alt+Backspace cuts the word before the cursor, Alt+D the one
 *   after it
 * - Ctrl+K cuts to the end of the line, Alt+K to the start
 * - Ctrl+Y pastes back whatever was cut last, and consecutive cuts join
 *   together into one piece
 * - Ctrl+X clears the line outright
 *
 * Rearranging what is there:
 *
 * - Ctrl+T swaps the two characters around the cursor, Alt+T the two words
 * - Alt+U puts the next word in upper case, Alt+L in lower case
 *
 * History, completion and finishing:
 *
 * - Up and Down, or Ctrl+P and Ctrl+N, step through previous lines
 * - Page Up and Page Down look through them for one starting with whatever has
 *   been typed so far
 * - Tab completes, and pressing it again lists the candidates when more than
 *   one of them fits
 * - Enter, or Ctrl+J, hands the line to `handleInput`; Ctrl+G abandons it
 * - Ctrl+Q takes the next key literally, so a control character can be typed
 * - Ctrl+D on an empty line stops the prompt, and Ctrl+C twice in a row exits
 *
 * Ctrl+R and Ctrl+S do nothing: there is no incremental search.
 */
declare var InteractivePrompt: InteractivePromptConstructor;

interface InteractivePromptConstructor {
  /**
   * Make a prompt which calls `handleInput` with each line the user enters.
   * Nothing is printed and no input is read until you call `start`.
   */
  new (
    handleInput: (input: string) => void,
    options?: {
      /**
       * The text to print in front of the line the user is editing. Called once
       * for each new line, so it can change as your program does.
       *
       * Defaults to `"> "`.
       */
      prompt?: () => string;

      /**
       * Draws the line the user is editing, receiving its current text. Write
       * it out yourself using `std.puts`, so that you can colour it or mark
       * it up; do not add a trailing newline.
       *
       * Providing this also means the whole line is redrawn on every keystroke,
       * which is what any highlighting needs, since a character typed now can
       * change how earlier ones should look. Leave it out and the line is
       * echoed plainly as it is typed.
       */
      printInput?: (input: string) => void;

      /**
       * Name of a file to keep this prompt's history in. Every line the user
       * accepts is appended to it, and a prompt started later with the same
       * name begins with those lines already loaded, so the up and down arrows
       * reach them. Leave it out and history lasts only as long as the prompt
       * is running.
       *
       * The file is placed in yavascript's config directory, which is:
       *
       * - on Windows: `yavascript` inside `%APPDATA%`
       * - on macOS: `Library/Application Support/yavascript` inside `$HOME`
       * - anywhere else: `yavascript` inside `$XDG_CONFIG_HOME`, or
       *   `.config/yavascript` inside `$HOME` when `$XDG_CONFIG_HOME` is not
       *   set
       *
       * Should the environment variable a platform relies on be unset, there is
       * nowhere to write the file, and history is kept for the current session
       * only as though no name had been given.
       */
      historyFileName?: string;

      /**
       * The completions available at `cursorIndex` within `line`. Called every
       * time the user presses Tab.
       */
      getCompletions?: (
        line: string,
        cursorIndex: number,
      ) => InteractivePromptCompletions;
    },
  ): InteractivePrompt;

  prototype: InteractivePrompt;
}

/**
 * A prompt which reads lines from the user, with readline-style editing keys,
 * history recall and Tab completion. See the `InteractivePrompt` global for the
 * full list of keys it binds.
 */
interface InteractivePrompt {
  /**
   * The text to print in front of the line the user is editing. Called once for
   * each new line, so it can change as your program does.
   *
   * Defaults to `"> "`.
   */
  prompt?: () => string;

  /**
   * Draws the line the user is editing, receiving its current text. Write it
   * out yourself using `std.puts`, so that you can colour it or mark it up; do
   * not add a trailing newline.
   *
   * Providing this also means the whole line is redrawn on every keystroke,
   * which is what any highlighting needs, since a character typed now can
   * change how earlier ones should look. Leave it out and the line is echoed
   * plainly as it is typed.
   */
  printInput?: (input: string) => void;

  /**
   * Name of a file to keep this prompt's history in. Every line the user
   * accepts is appended to it, and a prompt started later with the same name
   * begins with those lines already loaded, so the up and down arrows reach
   * them. Leave it out and history lasts only as long as the prompt is running.
   *
   * The file is placed in yavascript's config directory, which is:
   *
   * - on Windows: `yavascript` inside `%APPDATA%`
   * - on macOS: `Library/Application Support/yavascript` inside `$HOME`
   * - anywhere else: `yavascript` inside `$XDG_CONFIG_HOME`, or
   *   `.config/yavascript` inside `$HOME` when `$XDG_CONFIG_HOME` is not set
   *
   * Should the environment variable a platform relies on be unset, there is
   * nowhere to write the file, and history is kept for the current session only
   * as though no name had been given.
   */
  historyFileName?: string;

  /**
   * The completions available at `cursorIndex` within `line`. Called every time
   * the user presses Tab.
   */
  getCompletions?: (
    line: string,
    cursorIndex: number,
  ) => InteractivePromptCompletions;

  /**
   * Called with each line the user accepts by pressing Enter. Lines arrive one
   * at a time; nothing is held back waiting for a multi-line construct to be
   * finished off.
   */
  handleInput: (input: string) => void;

  /**
   * Print the first prompt and begin reading.
   *
   * This returns straight away instead of blocking; the prompt keeps running
   * off the event loop afterwards. It stops when the user presses Ctrl+D on an
   * empty line, or exits the process when they press Ctrl+C twice in a row.
   */
  start(): void;
}

/**
 * The candidate completions for a position in a line, as returned by
 * `InteractivePrompt`'s `getCompletions`.
 */
interface InteractivePromptCompletions {
  /**
   * The whole words which could complete what is being typed, rather than just
   * the parts still missing. When several of them match, pressing Tab a second
   * time lists these for the user to pick from, so they need to read as
   * complete words on their own.
   */
  candidates: Array<string>;
  /**
   * How many characters at the start of the candidates are already in the line,
   * immediately before the cursor. Those are left alone and the rest of the
   * candidate is typed in.
   *
   * Another way to read it: this is where you consider the word being completed
   * to begin, so what counts as one word is entirely up to you. A completer for
   * property names might treat a dot as a boundary, while one for file paths
   * would keep going through slashes.
   *
   * With `JSON.pars` typed and `parse` offered, a `prefixLength` of 4 leaves
   * `pars` as it is and types in the `e`.
   *
   * A candidate with a `prefixLength` of 0 shares nothing with the line and is
   * typed in whole, which is how you offer something that follows a finished
   * word instead of completing one: once `JSON.parse` is fully typed, offering
   * `(` gives the user `JSON.parse(`.
   */
  prefixLength: number;
}
