#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
cd "$SCRIPT_DIR"

cp ../../bin/x86_64-unknown-linux-static/yavascript ./yavascript-x86_64
cp ../../bin/aarch64-unknown-linux-static/yavascript ./yavascript-aarch64

mkdir -p empty

IMAGE_NAME="suchipi/yavascript"

# override to "latest" or "v1.2.3" via env var
TAG="${YS_DOCKER_TAG:-}"
if [[ "$TAG" == "" ]]; then
  TAG="dev-unstable-$(date +%s)"
fi

docker build -f Dockerfile.x86_64 -t "${IMAGE_NAME}:${TAG}-x86_64" .
docker build -f Dockerfile.aarch64 -t "${IMAGE_NAME}:${TAG}-aarch64" .

# have to push them to be able to make a manifest list :(
docker push "${IMAGE_NAME}:${TAG}-x86_64"
docker push "${IMAGE_NAME}:${TAG}-aarch64"

docker manifest create "${IMAGE_NAME}:${TAG}" \
  --amend "${IMAGE_NAME}:${TAG}-x86_64" \
  --amend "${IMAGE_NAME}:${TAG}-aarch64"

docker manifest annotate --arch amd64 "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:${TAG}-x86_64"
docker manifest annotate --arch arm64 "${IMAGE_NAME}:${TAG}" "${IMAGE_NAME}:${TAG}-aarch64"

docker manifest push "${IMAGE_NAME}:${TAG}"

echo "Done building and pushing: ${IMAGE_NAME}:${TAG}"
