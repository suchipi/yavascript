import { evaluate } from "./test-helpers";

test("whoami", async () => {
  const result = await evaluate(`
    const result = whoami();
    // We avoid printing the actual values since they will vary from system to
    // system and therefore won't result in a stable snapshot
    console.log(Object.keys(result));
    console.log("name:", typeof result.name);
    console.log("uid:", typeof result.uid);
    console.log("gid:", typeof result.gid);
  `);
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "[
      "name"
      "uid"
      "gid"
    ]
    name: string
    uid: number
    gid: number
    ",
    }
  `);
});
