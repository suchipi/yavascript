#!/usr/bin/env yavascript
/// <reference path="../../yavascript.d.ts" />

cd(__dirname);

copy(
  "../../bin/x86_64-unknown-linux-static/yavascript",
  "./yavascript-x86_64",
  { whenTargetExists: "overwrite" }
);

copy(
  "../../bin/aarch64-unknown-linux-static/yavascript",
  "./yavascript-aarch64",
  { whenTargetExists: "overwrite" }
);

ensureDir("empty");

const IMAGE_NAME = "suchipi/yavascript";

// override to "latest" or "v1.2.3" via env var
const TAG = env.YS_DOCKER_TAG
  ? env.YS_DOCKER_TAG
  : "dev-unstable-" + Date.now();

exec(`docker build -f Dockerfile.x86_64 -t ${IMAGE_NAME}:${TAG}-x86_64 .`);
exec(`docker build -f Dockerfile.aarch64 -t ${IMAGE_NAME}:${TAG}-aarch64 .`);

// have to push them to be able to make a manifest list :(
exec(`docker push ${IMAGE_NAME}:${TAG}-x86_64`);
exec(`docker push ${IMAGE_NAME}:${TAG}-aarch64`);

exec(
  `docker manifest create ${IMAGE_NAME}:${TAG}
    --amend ${IMAGE_NAME}:${TAG}-x86_64
    --amend ${IMAGE_NAME}:${TAG}-aarch64`
);
exec(
  `docker manifest annotate --arch amd64 ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:${TAG}-x86_64`
);
exec(
  `docker manifest annotate --arch arm64 ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:${TAG}-aarch64`
);
exec(`docker manifest push ${IMAGE_NAME}:${TAG}`);

echo(`Done building and pushing: ${IMAGE_NAME}:${TAG}`);
