#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

import * as preact from "npm:preact@^10.5.0";

JSX.createElement = preact.createElement;
JSX.Fragment = preact.Fragment;

echo(<a />);
