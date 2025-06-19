const child = new ChildProcess("sleep 2", {
  stdio: {
    out: std.out,
    err: std.err,
  },
  logging: { trace: console.error },
});

console.log("before start", child.state.id);
console.log("calling start...");
const pid = child.start();
console.log("after start", child.state.id);
sleep(1000);
console.log("after 1000ms", child.state.id);
sleep(2000);
console.log("after 2000ms", child.state.id);
console.log("calling waitUntilComplete...");
child.waitUntilComplete();
console.log("after waitUntilComplete", child.state.id);
