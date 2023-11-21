import * as std from "quickjs:std";
import { ChildProcess } from "./ChildProcess";
import { types } from "../types";
import { assert } from "../assert";

export class ExecResult<StdioType extends ArrayBuffer | string | never> {
  child: ChildProcess;
  stdioType: "arraybuffer" | "utf8" | null;
  private _trace?: undefined | null | ((...args: Array<any>) => void);

  constructor({
    child,
    stdioType,
    trace,
  }: {
    child: ChildProcess;
    stdioType: "arraybuffer" | "utf8" | null;
    trace?: undefined | null | ((...args: Array<any>) => void);
  }) {
    assert.type(
      child,
      types.object,
      "'child' option must be a ChildProcess object"
    );
    assert.type(
      stdioType,
      types.or("arraybuffer", "utf8", null),
      "'stdioType' option must be either 'arraybuffer', 'utf8', or null"
    );
    assert.type(
      trace,
      types.or(undefined, null, types.Function),
      "'trace' option must be either undefined, null, or a function"
    );

    this.child = child;
    this.stdioType = stdioType;
    this._trace = trace;
  }

  private _getStdio(which: "out" | "err"): StdioType {
    const trace = this._trace;

    if (this.stdioType === null) {
      throw new Error(
        "The stdout of the child process associated with this ExecResult was not captured. Provide the 'captureOutput' option to `exec` in order to capture stdout and stderr."
      );
    }

    this.child.waitUntilComplete();
    const stream = this.child.stdio[which];

    if (this.stdioType === "utf8") {
      // seek back to beginning
      stream.seek(0, std.SEEK_SET);
      return stream.readAsString() as any;
    } else {
      const len = stream.tell();
      const result = new ArrayBuffer(len);

      // seek back to beginning
      stream.seek(0, std.SEEK_SET);

      const bytesRead = stream.read(result, 0, len);
      if (bytesRead !== len && trace != null) {
        // throwing an error at this point seems kinda hostile idk, like the
        // process has already run to completion, you know? this *shouldn't*
        // ever happen, in theory, but...
        trace(
          `WEIRD! stdio stream reported it was ${len}, but when we read it back, it was ${bytesRead}. Continuing anyway...`
        );
      }

      return result as any;
    }
  }

  get stdout(): StdioType {
    return this._getStdio("out");
  }

  get stderr(): StdioType {
    return this._getStdio("err");
  }

  get status(): number | undefined {
    this.child.waitUntilComplete();
    if (this.child.state.id === "exited") {
      return this.child.state.status;
    } else {
      return undefined;
    }
  }

  get signal(): number | undefined {
    this.child.waitUntilComplete();
    if (this.child.state.id === "signaled") {
      return this.child.state.signal;
    } else {
      return undefined;
    }
  }
}
