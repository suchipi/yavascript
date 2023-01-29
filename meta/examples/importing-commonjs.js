#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

import * as stuff from "./some-commonjs";
echo(stuff);

const stuff2 = require("./some-commonjs");
echo(stuff2);
