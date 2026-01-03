import { makeGetterPropertyDescriptorMap } from "../../lazy-load";

export default makeGetterPropertyDescriptorMap(
  {
    ensureDir() {
      throw new ReferenceError("'ensureDir' has been renamed to 'mkdirp'.");
    },
    cp() {
      throw new ReferenceError("'cp' is not defined. Did you mean 'copy'?");
    },
    mv() {
      throw new ReferenceError("'mv' is not defined. Did you mean 'rename'?");
    },
    ren() {
      throw new ReferenceError("'ren' is not defined. Did you mean 'rename'?");
    },
    rm() {
      throw new ReferenceError("'rm' is not defined. Did you mean 'remove'?");
    },
    grep() {
      throw new ReferenceError(
        "'grep' is not defined. Maybe you want 'grepFile', 'grepString', or 'String.prototype.grep'?",
      );
    },
    man() {
      throw new ReferenceError("'man' is not defined. Did you mean 'help'?");
    },
    cwd() {
      throw new ReferenceError("'cwd' is not defined. Did you mean 'pwd'?");
    },
    where() {
      throw new ReferenceError("'where' is not defined. Did you mean 'which'?");
    },
    id() {
      throw new ReferenceError(
        "'id' is not defined. Maybe you want to use 'whoami()'?",
      );
    },
    openURL() {
      throw new ReferenceError(
        "'openURL' is not defined. Did you mean 'openUrl'?",
      );
    },
  },
  false,
);
