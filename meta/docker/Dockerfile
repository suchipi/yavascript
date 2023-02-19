FROM scratch
COPY --from=tarampampam/curl:7.78.0 /bin/curl /bin/curl
COPY ./yavascript /bin/yavascript
COPY ./empty /tmp

ENTRYPOINT ["/bin/yavascript"]
