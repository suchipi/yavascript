import * as os from "os";
import * as inspectOptions from "./inspect-options";
import { blue } from "./api/strings";

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

    try {
      const execPath = os.realpath(os.execPath());
      if (new RegExp(execPath).test(error.stack)) {
        file.puts(
          blue(
            `To view the code inside ${JSON.stringify(
              execPath
            )} as referred to in the above stack trace, run '${execPath} --print-src > yavascript-source.js', then open the newly-created file 'yavascript-source.js.'\n`
          )
        );
      }
    } catch (err) {
      // ignore
    }
  } else {
    file.puts("Non-error value was thrown: ");
    file.puts(inspect(error, inspectOptions.forPrint));
    file.puts("\n");
  }
}
