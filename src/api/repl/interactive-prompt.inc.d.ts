/**
 * This API is a work-in-progress and is subject to change at any time.
 */
interface InteractivePrompt {
  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (
    line: string,
    pos: number
  ) => {
    // TODO refactor these to have better key names
    tab: Array<string>;
    pos: number;
    ctx: { [key: string | number | symbol]: any };
  };

  handleInput: (input: string) => void;
  start(): void;
}

/**
 * This API is a work-in-progress and is subject to change at any time.
 */
interface InteractivePromptConstructor {
  new (
    handleInput: (input: string) => void,
    options?: {
      prompt?: () => string;
      printInput?: (input: string) => void;
      historyFileName?: string;
      getCompletions?: (
        line: string,
        pos: number
      ) => {
        // TODO refactor these to have better key names
        tab: Array<string>;
        pos: number;
        ctx: { [key: string | number | symbol]: any };
      };
    }
  ): InteractivePrompt;

  prototype: InteractivePrompt;
}

/**
 * This API is a work-in-progress and is subject to change at any time.
 */
declare var InteractivePrompt: InteractivePromptConstructor;
