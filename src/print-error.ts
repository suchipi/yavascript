import * as std from "std";
import * as inspectOptions from "./inspect-options";

const normalProps = new Set(["name", "message", "stack"]);

export default function printError(error: any, file: FILE) {
  if (
    typeof error === "object" &&
    error != null &&
    typeof error.name === "string" &&
    typeof error.message === "string" &&
    typeof error.stack === "string"
  ) {
    file.puts(error.name);
    file.puts(": ");
    file.puts(error.message);
    file.puts("\n");
    file.puts(
      error.stack
        .split("\n")
        .map((line: string) => line.replace(/^\s+/, "  "))
        .join("\n")
        .replace(/\s+$/, "")
    );

    let extraProps: Array<string> = [];
    try {
      extraProps = Object.getOwnPropertyNames(error).filter(
        (name) => !normalProps.has(name)
      );
    } catch (err) {
      // ignored
    }

    if (extraProps.length > 0) {
      const propsObj = {};
      for (const key of extraProps) {
        propsObj[key] = error[key];
      }
      file.puts(" ");
      file.puts(inspect(propsObj, inspectOptions.forPrint));
    }

    file.puts("\n");
  } else {
    file.puts("Non-error value was thrown: ");
    file.puts(inspect(error, inspectOptions.forPrint));
    file.puts("\n");
  }
}
