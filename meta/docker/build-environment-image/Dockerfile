FROM node:18.12.1-bullseye

RUN apt-get update && apt-get -y install ninja-build bat

# the intent is that you volume-mount the repo here
WORKDIR /opt/yavascript

ENV SKIP_FNM_USE=1

ENTRYPOINT /bin/bash
