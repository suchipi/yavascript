/**
 * Prints help and usage text about the provided value, if any is available.
 */
declare var help: {
  /**
   * Prints help and usage text about the provided value, if any is available.
   */
  (value?: any): void;

  /**
   * Set the help text for the provided value to the provided string.
   *
   * If the value is later passed into the `help` function, the provided text
   * will be printed.
   */
  setHelpText: {
    /**
     * Set the help text for the provided value to the provided string.
     *
     * If the value is later passed into the `help` function, the provided text
     * will be printed.
     *
     * To set help text for the values `null` or `undefined`, `allowNullish`
     * must be `true`.
     */
    (value: object, text: string, allowNullish?: boolean): void;

    /**
     * Lazily sets the help text for the provided value using the provided
     * string-returning function.
     *
     * The first time help text is requested for the value, the string-returning
     * function will be called, and its result will be registered as the help
     * text for the value. Afterwards, the function will not be called again;
     * instead, it will re-use the text returned from the first time the
     * function was called.
     */
    lazy(value: object, getText: () => string): void;
  };
};
