FROM scratch
COPY ./bin/linux-amd64/yavascript /
ENTRYPOINT ["/yavascript"]
