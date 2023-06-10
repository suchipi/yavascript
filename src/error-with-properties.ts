import * as inspectOptions from "./inspect-options";

const MAX_ERROR_MESSAGE_LENGTH = 1000 - 3; // minus 3 for ellipsis

export function makeErrorWithProperties<
  Properties extends { [key: string]: any },
  ErrConstructor extends { new (message: string): any }
>(
  message: string,
  properties: Properties,
  // @ts-ignore could be instantiated with different subtype
  errorConstructor: ErrConstructor = Error
): Properties & ErrConstructor extends { new (message: string): infer Err }
  ? Err
  : never {
  let errorMessage = message;
  const entries = Object.entries(properties);
  if (entries.length > 0) {
    errorMessage += " (";
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      errorMessage += key;
      errorMessage += " = ";
      errorMessage += inspect(value, inspectOptions.forError()).replace(
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

  const err = new errorConstructor(errorMessage);
  return Object.assign(err, properties);
}
