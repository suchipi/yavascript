import { runYavascript, rootDir } from "./test-helpers";

const fixturesDir = rootDir.concat("meta/tests/fixtures/import-attributes");

test("civet", async () => {
  const result = await runYavascript([fixturesDir("load-civet.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "4
   yeah
   ",
   }
  `);
});

test("coffee", async () => {
  const result = await runYavascript([fixturesDir("load-coffee.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "4
   yeah
   ",
   }
  `);
});

test("js", async () => {
  const result = await runYavascript([fixturesDir("load-js.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "4
   yeah
   ",
   }
  `);
});

test("json", async () => {
  const result = await runYavascript([fixturesDir("load-json.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     json: "yup"
   }
   ",
   }
  `);
});

test("json5", async () => {
  const result = await runYavascript([fixturesDir("load-json5.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     json5: "yup"
   }
   ",
   }
  `);
});

test("toml", async () => {
  const result = await runYavascript([fixturesDir("load-toml.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     title: "TOML Example"
     owner: {
       name: "Tom Preston-Werner"
       dob: "1979-05-27T15:32:00.000Z"
     }
     database: {
       enabled: true
       ports: [
         8000
         8001
         8002
       ]
       data: [
         [
           "delta"
           "phi"
         ]
         [
           3.14
         ]
       ]
       temp_targets: {
         cpu: 79.5
         case: 72
       }
     }
     servers: {
       alpha: {
         ip: "10.0.0.1"
         role: "frontend"
       }
       beta: {
         ip: "10.0.0.2"
         role: "backend"
       }
     }
   }
   ",
   }
  `);
});

test("ts", async () => {
  const result = await runYavascript([fixturesDir("load-ts.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "yeah
   ",
   }
  `);
});

test("tsx", async () => {
  const result = await runYavascript([fixturesDir("load-tsx.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     $$typeof: Symbol(JSX.Element)
     type: "a"
     props: null
     key: null
   }
   {
     $$typeof: Symbol(JSX.Element)
     type: "link"
     props: null
     key: null
   }
   ",
   }
  `);
});

test("yml", async () => {
  const result = await runYavascript([fixturesDir("load-yml.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     version: 2.1
     jobs: {
       build: {
         docker: [
           {
             image: "cimg/base:2023.03"
           }
         ]
         steps: [
           "checkout"
           {
             run: "echo "this is the build job""
           }
         ]
       }
       test: {
         docker: [
           {
             image: "cimg/base:2023.03"
           }
         ]
         steps: [
           "checkout"
           {
             run: "echo "this is the test job""
           }
         ]
       }
     }
     workflows: {
       build_and_test: {
         jobs: [
           "build"
           "test"
         ]
       }
     }
   }
   ",
   }
  `);
});

test("yaml", async () => {
  const result = await runYavascript([fixturesDir("load-yaml.js")]);
  expect(result).toMatchInlineSnapshot(`
   {
     "code": 0,
     "error": null,
     "stderr": "",
     "stdout": "{
     version: 2.1
     jobs: {
       build: {
         docker: [
           {
             image: "cimg/base:2023.03"
           }
         ]
         steps: [
           "checkout"
           {
             run: "echo "this is the build job""
           }
         ]
       }
       test: {
         docker: [
           {
             image: "cimg/base:2023.03"
           }
         ]
         steps: [
           "checkout"
           {
             run: "echo "this is the test job""
           }
         ]
       }
     }
     workflows: {
       build_and_test: {
         jobs: [
           "build"
           "test"
         ]
       }
     }
   }
   ",
   }
  `);
});
