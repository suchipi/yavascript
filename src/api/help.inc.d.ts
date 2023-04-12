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
  setHelpText(value: object, text: string): void;
};
