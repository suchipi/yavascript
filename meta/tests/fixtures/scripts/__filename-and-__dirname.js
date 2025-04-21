#!/usr/bin/env yavascript
/// <reference path="../../../yavascript.d.ts" />

echo({ __filename, __dirname });

import resultsFromOtherModule from "./__filename-and-__dirname-2.js";

echo(resultsFromOtherModule);
