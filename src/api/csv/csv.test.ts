import { evaluate } from "../../test-helpers";

test("CSV", async () => {
  const result = await evaluate(
    `
      const table = [
        ["a", "b", "c"],
        ["d", "e", "f"]
      ];

      const csv = CSV.stringify(table);
      const reparsed = CSV.parse(csv);

      console.log({
        table,
        csv,
        reparsed
      })
    `
  );
  expect(result).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "{
      table: [
        [
          "a"
          "b"
          "c"
        ]
        [
          "d"
          "e"
          "f"
        ]
      ]
      csv: "a,b,c\\r\\nd,e,f"
      reparsed: [
        [
          "a"
          "b"
          "c"
        ]
        [
          "d"
          "e"
          "f"
        ]
      ]
    }
    ",
    }
  `);
});
