# Persist Long-Running Command Output to .tmp/

Pipe long-running command output to a file under `.tmp/` instead of running bare and reading only the tail. Re-running a 2-minute test suite to see output you skipped is wasteful; a single run plus persisted log suffices.

```bash
npm test > .tmp/test-output.log 2>&1; echo "exit=$?"
```

Then read the log.
