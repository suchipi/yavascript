import { hasColors } from "../../has-colors";
import { blue, underline } from "../strings";

export function help() {
  let url =
    "https://github.com/suchipi/yavascript/blob/main/meta/generated-docs/README.md";
  if (hasColors()) {
    url = underline(blue(url));
  }
  console.log("\nPlease see: " + url + "\n");
}
