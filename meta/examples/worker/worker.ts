import * as os from "quickjs:os";

Worker.parent.onmessage = (event: { data: os.StructuredClonable }) => {
  console.log("hi from worker", inspect(event));
  Worker.parent.postMessage("yeah hi");
};

console.log(yavascript);
