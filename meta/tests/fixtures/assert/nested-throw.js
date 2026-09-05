// lots of comments
// to push the assertion right over the
// 1-char/2-char line number boundary

function outer() {
  inner();
}

function inner() {
  assert(2 + 2 === 5, "OHHH this is sad day!!");
}

outer();
