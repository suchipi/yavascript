/// <reference path="./dist/tonna.d.ts" />

try {
  const ret = exec(["false"]);
  console.log(ret);
} catch (err) {
  console.error(err);
}

const ret2 = $(["echo", "hi", "there"]);
console.log(ret2);
