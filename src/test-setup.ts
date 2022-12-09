import path from "path";
import expect from "expect";
import chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";
import { getCurrentTestInfo } from "@littlethings/test";
import { cleanResult } from "./test-helpers";

const g: any = globalThis;

g.expect = expect;
g.test = g.it;

chai.use(chaiJestSnapshot);

const hasOwnProperty = Object.prototype.hasOwnProperty;

const cleaned = new WeakMap<any, boolean>();

chaiJestSnapshot.addSerializer({
  test: (val: any) =>
    typeof val === "object" &&
    val != null &&
    typeof val.stdout === "string" &&
    typeof val.stderr === "string" &&
    hasOwnProperty.call(val, "code") &&
    hasOwnProperty.call(val, "error") &&
    !cleaned.has(val),
  print: (val: any, serialize: (input: any) => string) => {
    const cleanedResult = cleanResult(val);
    cleaned.set(cleanedResult, true);
    return serialize(cleanedResult);
  },
});

beforeAll(() => {
  chaiJestSnapshot.resetSnapshotRegistry();
});

beforeEach(() => {
  const info = getCurrentTestInfo();
  if (!info) return;
  const [filepath, ...testNameParts] = info.context;

  const filename = path.basename(filepath);
  const dirname = path.dirname(filepath);

  chaiJestSnapshot.setFilename(
    path.join(dirname, "__snapshots__", filename) + ".snap"
  );
  chaiJestSnapshot.setTestName(testNameParts.join(" "));
});

expect.extend({
  toMatchSnapshot(actual: any) {
    let message = "No message";
    let pass = false;

    try {
      chai.expect(actual).to.matchSnapshot();
      pass = true;
    } catch (err: any) {
      message = err.message;
    }

    return { message: () => message, pass };
  },
});
