import print from "print";

function isProbablyError(value: any): boolean {
  return (
    typeof value === "object" &&
    value != null &&
    typeof value.name === "string" &&
    typeof value.message === "string" &&
    typeof value.stack === "string"
  );
}

const printOptions = {
  ampedSymbols: false,
  maxArrayLength: 100,
  showAll: true,
  showArrayLength: true,
  sortProps: false,
};

function leadingTabsToSpaces(line: string): string {
  const matches = line.match(/^(\t+)/);
  if (!matches) return line;
  return line.replace(matches[1], "  ".repeat(matches[1].length));
}

export function inspect(value: any): string {
  if (typeof value === "string") {
    return value;
  } else if (isProbablyError(value)) {
    const { name, message, stack, ...otherProps } = value;
    let suffix = "";
    if (Object.keys(otherProps).length > 0) {
      try {
        const indent = " ".repeat(4);
        suffix =
          "\n" +
          indent +
          "with properties: " +
          print(otherProps, undefined, printOptions)
            .split("\n")
            .map((line: string) => indent + leadingTabsToSpaces(line))
            .join("\n")
            .trimStart();
      } catch (err) {
        // ignore
      }
    }

    return `${name}: ${message}\n${String(stack).trimEnd()}${suffix}`;
  } else {
    return print(value, undefined, printOptions)
      .split("\n")
      .map(leadingTabsToSpaces)
      .join("\n");
  }
}
