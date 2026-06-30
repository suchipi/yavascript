a = 1
b = 2
boom = ->
  throw new Error "caught-coffee-boom"
try
  boom()
catch e
  console.log "stack:"
  console.log e.stack
  console.log "lineNumber:", e.lineNumber
  console.log "columnNumber:", e.columnNumber
