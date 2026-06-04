import * as os from "quickjs:os";

os.Worker.parent.onmessage = (event: { data: os.StructuredClonable }) => {
  console.log("hi from worker", inspect(event));
  os.Worker.parent.postMessage("yeah hi");
};
