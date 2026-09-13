# Use .tmp/ Instead of /tmp

Every file you create that is not part of the project goes in `.tmp/` in the repo root, including reports and other things you hand to the user. It already exists and is gitignored. Say where you put the file.

This overrides the environment block's "Scratchpad directory", wherever that points. Same for `/tmp`, `/private/tmp`, `$TMPDIR`, and `mktemp`. Write elsewhere only when the user names the location.
