#!/usr/bin/env bash

set -euo pipefail

INPUT_PATH="${1:-}"
OUTPUT_PATH="${2:-}"

if [[ "$INPUT_PATH" == "" ]] || [[ "$OUTPUT_PATH" == "" ]]; then
  >&2 echo "This script requires two arguments: the input file path and the output file path."
  exit 1
fi

mkdir -p `dirname "$OUTPUT_PATH"`;
glow -s dark "$INPUT_PATH" > "$OUTPUT_PATH"

echo "$OUTPUT_PATH"
