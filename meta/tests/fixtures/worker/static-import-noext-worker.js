// The extensionless specifier only resolves if the worker uses yavascript's
// searchExtensions rather than the engine default of [".js"].
import { fromTs } from "./static-import-lib";

Worker.parent.postMessage(fromTs);
