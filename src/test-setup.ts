import expect from "expect";

const g: any = globalThis;

g.expect = expect;
g.test = g.it;
