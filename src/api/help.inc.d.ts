/**
 * Prints help and usage text about the provided value, if any is available.
 */
declare var help: {
  /**
   * Prints help and usage text about the provided value, if any is available.
   */
  (value?: any): void;

  // TODO doc comment
  registerHelpForValue(value: any, text: string): void;

  // TODO doc comment
  registerHelpProvider(provider: (value: unknown) => string | null): void;
};
