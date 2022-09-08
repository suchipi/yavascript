import * as inspectOptions from "./inspect-options";

const MAX_ERROR_MESSAGE_LENGTH = 1000 - 3; // minus 3 for ellipsis

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

  if (errorMessage.length > MAX_ERROR_MESSAGE_LENGTH) {
    errorMessage = errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) + "...";
  }

  const err = new Error(errorMessage);
  return Object.assign(err, properties);
}
