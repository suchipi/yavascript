const logThrowMessage = (val, type) => {
  try {
    assert.type(val, type);
  } catch (err: any) {
    console.log(err.message);
    return;
  }
  console.log(
    "no error message from",
    val,
    is(type, Function) ? type.name : type,
  );
};

logThrowMessage("hi", string);
logThrowMessage(null, string); // throws
logThrowMessage(24, string); // throws

logThrowMessage("hi", "hi");
logThrowMessage("yes", "hi"); // throws
logThrowMessage("something", number); // throws

logThrowMessage(42, number);
