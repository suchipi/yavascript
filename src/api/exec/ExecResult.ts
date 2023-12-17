import * as std from "quickjs:std";
import { ChildProcess } from "./ChildProcess";
import { types } from "../types";
import { assert } from "../assert";
import { setHelpText } from "../help";
import execResultHelpText from "./ExecResult.help.md";
import { setBytecodeClassToString } from "../../set-bytecode-class-tostring";

export class ExecResult<
  StdioType extends ArrayBuffer | string | never,
  Finished extends boolean = false
> {
  child: ChildProcess;
  stdioType: StdioType extends ArrayBuffer
    ? "arraybuffer"
    : StdioType extends string
    ? "utf8"
    : null;
  private _trace?: undefined | null | ((...args: Array<any>) => void);

  constructor({
    child,
    stdioType,
    trace,
  }: {
    child: ChildProcess;
    stdioType: StdioType extends ArrayBuffer
      ? "arraybuffer"
      : StdioType extends string
      ? "utf8"
      : null;
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

  private _assertDone(
    request: string
  ): asserts this is ExecResult<StdioType, true> {
    if (this.child.state.id === "unstarted") {
      throw new Error(
        `Cannot get ${request} of child process because it has not yet been started. Please call \`.wait()\` first.`
      );
    }
    if (this.child.state.id === "running") {
      throw new Error(
        `Cannot get ${request} of child process because it has not yet finished running. Please call \`.wait()\` first.`
      );
    }
  }

  get stdout(): Finished extends true ? StdioType : never {
    this._assertDone("stdout");
    const result: StdioType = this._getStdio("out");
    // @ts-ignore returning into never
    return result;
  }

  get stderr(): Finished extends true ? StdioType : never {
    this._assertDone("stderr");
    const result: StdioType = this._getStdio("err");
    // @ts-ignore returning into never
    return result;
  }

  get status(): Finished extends true ? number | undefined : never {
    this._assertDone("exit status");
    if (this.child.state.id === "exited") {
      // @ts-ignore returning into never
      return this.child.state.status;
    } else {
      // @ts-ignore returning into never
      return undefined;
    }
  }

  get signal(): Finished extends true ? number | undefined : never {
    this._assertDone("exit signal");
    if (this.child.state.id === "signaled") {
      // @ts-ignore returning into never
      return this.child.state.signal;
    } else {
      // @ts-ignore returning into never
      return undefined;
    }
  }

  wait(): ExecResult<StdioType, true> {
    this.child.waitUntilComplete();
    return this as ExecResult<StdioType, true>;
  }
}

setBytecodeClassToString(ExecResult);
setHelpText(ExecResult, execResultHelpText);
