import * as std from "quickjs:std";
import * as os from "quickjs:os";

console.log("in worker");

os.Worker.parent.onmessage = (event) => {
  console.log("in worker, received:", inspect(event));
  if (event.data === "try-to-exit") {
    std.exit(1);
  }
};
