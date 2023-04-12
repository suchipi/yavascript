`help` - Print help text to stdout

Prints help and usage text about the provided value, if any is available.

When called without an argument, prints the help text for the `help` function itself.

```ts
// Defined in yavascript/src/api/help.ts
declare function help(value?: any): void;
```

To register help text for a provided value, use `help.setHelpText`:

```ts
// Defined in yavascript/src/api/help.ts
declare function help.setHelpText(value: object, text: string): void;
```

For example:

```ts
function myFunction(a: number, b: number) {
  return a + b;
}

help.setHelpText(myFunction, "myFunction: returns the sum of two numbers");
```

Then, your string will be printed when they use `help(myFunction)`

```
> help(myFunction);

myFunction: returns the sum of two numbers

>
```

If you want, you can use `String.dedent` on tagged template literals to format multiline text nicely. You can also use color/style functions like `red`, `dim`, and `bold`:

```ts
help.setHelpText(
  myFunction,
  String.dedent`
  ${bold(red("myFunction"))}: returns the sum of two numbers

  Examples:
    ${dim("Adding one and two")}
    myFunction(1, 2);

    ${dim("Storing the result")}
    const five = myFunction(2, 3);
`
);
```
