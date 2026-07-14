function one() {
  two();
}

function two() {
  assert(false, "nah!");
}

one();
