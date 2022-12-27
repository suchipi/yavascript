#!/usr/bin/env bash
set -ex

nvm use
env SKIP_FNM_USE=1 meta/build.sh
