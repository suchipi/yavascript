FROM charmcli/glow:v1.5.0 as glow
FROM node:18.12.1-bullseye
COPY --from=glow /usr/local/bin/glow /usr/local/bin/glow

RUN apt-get update && apt-get -y install ninja-build

# the intent is that you volume-mount the repo here
WORKDIR /opt/yavascript

ENV SKIP_FNM_USE=1

ENTRYPOINT /bin/bash
