///<reference types="@test-it/core/globals" />
import { transform } from "./esm-to-require";

test("ignores non-esm", async () => {
  expect(transform("2 + 2 == 4")).toBe("2 + 2 == 4");
});

test("ignores esm in string/template literal", async () => {
  for (const code of [
    "`import 'something';`;",
    `'import "something";';`,
    `"import 'something';";`,
  ]) {
    expect(transform(code)).toBe(code);
  }
});

test("ignores incorrect esm syntax", async () => {
  expect(transform(`import { hi`)).toBe(`import { hi`);
});

test("transforms bare import", async () => {
  expect(transform(`import "a"`)).toBe(`require("a")`);
  expect(transform(` import    'a'`)).toBe(`require('a')`);
  expect(transform(`import "std"`)).toBe(`require("std")`);
  expect(transform(`import 'std'`)).toBe(`require('std')`);
  expect(transform(` import    'a'`)).toBe(`require('a')`);
});

test("transforms namespace import", async () => {
  expect(transform(`import * as a from "a"`)).toBe(`a = require("a")`);
  expect(transform(`import       * \n as a   from    'a'`)).toBe(
    `a = require('a')`
  );
  expect(transform(`import * as std from "std"`)).toBe(`std = require("std")`);
  expect(transform(`import * as std from 'std'`)).toBe(`std = require('std')`);
});

test("transforms default import", async () => {
  expect(transform(`import a from "a"`)).toBe(`a = require("a").default`);
  expect(transform(`import      \n\t  a   from    'a'`)).toBe(
    `a = require('a').default`
  );
  expect(transform(`import std from "std"`)).toBe(
    `std = require("std").default`
  );
  expect(transform(`import std from 'std'`)).toBe(
    `std = require('std').default`
  );
});

test("transforms named import", async () => {
  expect(transform(`import { a } from "a"`)).toBe(`({ a } = require("a")); a`);
  expect(transform(`import { a, b, c } from "a"`)).toBe(
    `({ a, b, c } = require("a")); ({ a, b, c })`
  );
  expect(transform(`import { a as b } from "a"`)).toBe(
    `({ a: b } = require("a")); b`
  );
  expect(transform(`import { abc as def } from 'abc'`)).toBe(
    `({ abc: def } = require('abc')); def`
  );
  expect(transform(`import { $one, two2, three3 as fo4ur } from 'abc'`)).toBe(
    `({ $one, two2, three3: fo4ur } = require('abc')); ({ $one, two2, fo4ur })`
  );
});
