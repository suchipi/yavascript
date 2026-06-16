import * as cmdline from "quickjs:cmdline";

function exit(code?: number) {
  cmdline.exit(code);
}

Object.defineProperty(exit, "code", {
  get() {
    return cmdline.getExitCode();
  },
  set(newValue: number) {
    cmdline.setExitCode(newValue);
  },
});

const exit_: typeof exit & {
  code: number;
} = exit as any;

export { exit_ as exit };
