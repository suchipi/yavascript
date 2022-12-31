#!/usr/bin/env yavascript

# YavaScript has builtin support for parsing and executing CoffeeScript files.

# You can use import syntax...
import * as std from 'quickjs:std'
echo typeof std

# or require if you prefer
os = require 'quickjs:os'
echo typeof os

exec 'git status'

files = ls()

if isDir files[0]
  cd files[0]

echo pwd()

branchName = $ 'git rev-parse --abbrev-ref HEAD'
  .stdout
  .trim()

echo { branchName }

echo repoRoot()
