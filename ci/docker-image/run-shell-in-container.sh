#!/usr/bin/env bash
set -e

# Move to repo root
cd $(git rev-parse --show-toplevel)

./ci/docker-image/build-image.sh
docker run --rm -it -v $PWD:/opt/yavascript suchipi/yavascript-ci
