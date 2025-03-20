FROM node:22.8.0-bookworm

RUN apt-get update && apt-get -y install ninja-build

# the intent is that you volume-mount the repo here
WORKDIR /opt/yavascript

ENV SKIP_FNM_USE=1

ENTRYPOINT /bin/bash
