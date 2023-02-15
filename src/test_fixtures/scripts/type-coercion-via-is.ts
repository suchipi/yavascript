const logIs = (val, type) => console.log(is(val, type));

logIs("hi", string); // true
logIs(null, string); // false
logIs(24, string); // false

logIs("hi", "hi"); // true
logIs("yes", "hi"); // false
logIs("something", number); // false

logIs(42, number); // true
