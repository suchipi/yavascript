import { assert, Is } from "typescript-assert-utils";

// grepString call signatures and return types
{
  {
    const result = grepString("str", "str");
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/);
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {});
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {});
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {
      details: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepString("str", /regexp/, {
      details: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepString("str", "str", {
      details: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {
      details: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepString("str", "str", {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepString("str", /regexp/, {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepString("str", "str", {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepString("str", /regexp/, {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepString("str", "str", {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepString("str", /regexp/, {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }
}

// String.prototype.grep signatures and return types
{
  {
    const result = "str".grep("str");
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/);
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {});
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {});
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {
      details: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = "str".grep(/regexp/, {
      details: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = "str".grep("str", {
      details: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {
      details: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = "str".grep("str", {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = "str".grep(/regexp/, {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = "str".grep("str", {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = "str".grep(/regexp/, {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = "str".grep("str", {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = "str".grep(/regexp/, {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }
}

// grepFile call signatures and return types
{
  const path = new Path("somepath");

  {
    const result = grepFile("str", "str");
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/);
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str");
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/);
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {});
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {});
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {});
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {});
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile("str", /regexp/, {
      details: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile(path, /regexp/, {
      details: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {
      details: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {
      details: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {
      details: false,
      inverse: false,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile("str", /regexp/, {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile(path, /regexp/, {
      details: true,
      inverse: false,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile("str", /regexp/, {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result, Array<GrepMatchDetail>>>();
    const result2 = grepFile(path, /regexp/, {
      details: true,
      inverse: true,
    });
    assert<Is<typeof result2, Array<GrepMatchDetail>>>();
  }

  {
    const result = grepFile("str", "str", {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile("str", /regexp/, {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }

  {
    const result = grepFile(path, "str", {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result, Array<string>>>();
    const result2 = grepFile(path, /regexp/, {
      details: false,
      inverse: true,
    });
    assert<Is<typeof result2, Array<string>>>();
  }
}
