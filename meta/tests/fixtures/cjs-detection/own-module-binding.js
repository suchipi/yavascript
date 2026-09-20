const module = { name: "demo" };
const advice = `set module.exports to whatever you like`;
console.log(module.name, advice.includes("module.exports"));
