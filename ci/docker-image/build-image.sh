#!/usr/bin/env bash
set -e

# Move to repo root
cd $(git rev-parse --show-toplevel)

docker build -t suchipi/yavascript-ci -f ./ci/docker-image/Dockerfile.ci .

echo suchipi/yavascript-ci:latest
