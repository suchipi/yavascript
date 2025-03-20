import * as std from "quickjs:std";

function exit(code?: number) {
  std.exit(code);
}

Object.defineProperty(exit, "code", {
  get() {
    return std.getExitCode();
  },
  set(newValue: number) {
    std.setExitCode(newValue);
  },
});

const exit_: typeof exit & {
  code: number;
} = exit as any;

export { exit_ as exit };
