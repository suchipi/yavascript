FROM --platform=linux/amd64 ubuntu:22.04

RUN dpkg --add-architecture i386 && \
  apt-get update && apt-get install -y \
    wine wine32

RUN mkdir /wineprefix
ENV WINEPREFIX=/wineprefix

ADD sample.bat /opt/sample.bat

# run wine once to make all those first-time error messages go away.
# it fails to actually *run* sample.bat, but making it try is enough
# to make the first-time error messages go away.
RUN wine /opt/sample.bat || true
