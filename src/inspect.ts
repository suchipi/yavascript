import { format } from "pretty-format";

function isProbablyError(value: any): boolean {
  return (
    typeof value === "object" &&
    value != null &&
    typeof value.name === "string" &&
    typeof value.message === "string" &&
    typeof value.stack === "string"
  );
}

const formatOptions = {
  callToJSON: false,
  maxDepth: 8,
  maxWidth: 100,
  printFunctionName: true,
};

export default function inspect(value: any): string {
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
          format(otherProps, formatOptions)
            .split("\n")
            .map((line) => indent + line)
            .join("\n")
            .trimStart();
      } catch (err) {
        // ignore
      }
    }

    return `${name}: ${message}\n${String(stack).trimEnd()}${suffix}`;
  } else {
    return format(value, formatOptions);
  }
}
