import * as inspectOptions from "./inspect-options";

export function makeErrorWithProperties<
  Properties extends { [key: string]: any }
>(message: string, properties: Properties): Error & Properties {
  let errorMessage = message;
  const entries = Object.entries(properties);
  if (entries.length > 0) {
    errorMessage += " (";
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      errorMessage += key;
      errorMessage += " = ";
      errorMessage += inspect(value, inspectOptions.forError).replace(
        /\n+/g,
        " "
      );
      if (i !== entries.length - 1) {
        errorMessage += ", ";
      }
    }
    errorMessage += ")";
  }
  const err = new Error(errorMessage);
  return Object.assign(err, properties);
}
