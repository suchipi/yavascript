- [InteractivePrompt (interface)](#interactiveprompt-interface)
  - [InteractivePrompt.prompt (function property)](#interactivepromptprompt-function-property)
  - [InteractivePrompt.printInput (function property)](#interactivepromptprintinput-function-property)
  - [InteractivePrompt.historyFileName (string property)](#interactiveprompthistoryfilename-string-property)
  - [InteractivePrompt.getCompletions (function property)](#interactivepromptgetcompletions-function-property)
  - [InteractivePrompt.handleInput (function property)](#interactiveprompthandleinput-function-property)
  - [InteractivePrompt.start (method)](#interactivepromptstart-method)
- [InteractivePromptConstructor (interface)](#interactivepromptconstructor-interface)
  - [InteractivePromptConstructor new(...) (construct signature)](#interactivepromptconstructor-new-construct-signature)
  - [InteractivePromptConstructor.prototype (InteractivePrompt property)](#interactivepromptconstructorprototype-interactiveprompt-property)
- [InteractivePrompt (InteractivePromptConstructor)](#interactiveprompt-interactivepromptconstructor)

# InteractivePrompt (interface)

```ts
interface InteractivePrompt {
  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (
    line: string,
    pos: number
  ) => {
    tab: Array<string>;
    pos: number;
    ctx: {
      [key: string | number | symbol]: any;
    };
  };
  handleInput: (input: string) => void;
  start(): void;
}
```

## InteractivePrompt.prompt (function property)

```ts
prompt?: () => string;
```

## InteractivePrompt.printInput (function property)

```ts
printInput?: (input: string) => void;
```

## InteractivePrompt.historyFileName (string property)

```ts
historyFileName?: string;
```

## InteractivePrompt.getCompletions (function property)

```ts
getCompletions?: (line: string, pos: number) => {
  tab: Array<string>;
  pos: number;
  ctx: {
    [key: string | number | symbol]: any;
  };
};
```

## InteractivePrompt.handleInput (function property)

```ts
handleInput: (input: string) => void;
```

## InteractivePrompt.start (method)

```ts
start(): void;
```

# InteractivePromptConstructor (interface)

```ts
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
        tab: Array<string>;
        pos: number;
        ctx: {
          [key: string | number | symbol]: any;
        };
      };
    }
  ): InteractivePrompt;
  prototype: InteractivePrompt;
}
```

## InteractivePromptConstructor new(...) (construct signature)

```ts
new (handleInput: (input: string) => void, options?: {
  prompt?: () => string;
  printInput?: (input: string) => void;
  historyFileName?: string;
  getCompletions?: (line: string, pos: number) => {
    tab: Array<string>;
    pos: number;
    ctx: {
      [key: string | number | symbol]: any;
    };
  };
}): InteractivePrompt;
```

## InteractivePromptConstructor.prototype (InteractivePrompt property)

```ts
prototype: InteractivePrompt;
```

# InteractivePrompt (InteractivePromptConstructor)

wip experimental use at your own risk

```ts
var InteractivePrompt: InteractivePromptConstructor;
```
