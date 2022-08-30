FROM scratch
COPY ./bin/linux/yavascript /
ENTRYPOINT ["/yavascript"]
