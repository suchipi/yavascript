import { Path } from "../path";
import { setHelpText } from "../../help";

setHelpText.lazy(Path, () => require("./path.help.md"));

setHelpText.lazy(Path.OS_SEGMENT_SEPARATOR, () =>
  require("./Path.OS_SEGMENT_SEPARATOR.help.md")
);
setHelpText.lazy(Path.OS_ENV_VAR_SEPARATOR, () =>
  require("./Path.OS_ENV_VAR_SEPARATOR.help.md")
);
setHelpText.lazy(Path.OS_PROGRAM_EXTENSIONS, () =>
  require("./Path.OS_PROGRAM_EXTENSIONS.help.md")
);

setHelpText.lazy(Path.splitToSegments, () =>
  require("./Path.splitToSegments.help.md")
);
setHelpText.lazy(Path.detectSeparator, () =>
  require("./Path.detectSeparator.help.md")
);
setHelpText.lazy(Path.normalize, () => require("./Path.normalize.help.md"));
setHelpText.lazy(Path.isAbsolute, () => require("./Path.isAbsolute.help.md"));
setHelpText.lazy(Path.fromRaw, () => require("./Path.fromRaw.help.md"));
setHelpText.lazy(Path.prototype.normalize, () =>
  require("./Path.prototype.normalize.help.md")
);
