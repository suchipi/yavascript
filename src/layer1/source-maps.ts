import type { TraceMap, EncodedSourceMap } from "@jridgewell/trace-mapping";
import { logger } from "./api/logger";
import { memoizeFn } from "./lazy-load";

const getTraceMapping: () => typeof import("@jridgewell/trace-mapping") =
  memoizeFn(() => require("@jridgewell/trace-mapping"));

// A mapper for a transform that only shifts lines by a constant (identity
// columns, same source). Expressed in this manner rather than a normal
// sourcemap because trace-mapping snaps a query to the nearest segment rather
// than interpolating, so mapping every column back to itself would need a
// segment per character on every line, which gets big fast.
export type LineOffsetMapper = { lineOffset: number };

function isLineOffsetMapper(input: unknown): input is LineOffsetMapper {
  return (
    typeof input === "object" &&
    input !== null &&
    "lineOffset" in input &&
    input.lineOffset !== undefined
  );
}

type InputMapper = EncodedSourceMap | LineOffsetMapper;
type StorageMapper = TraceMap | LineOffsetMapper;

export type { InputMapper as Mapper };

// Key is by absolute path filename. Value is mappers ordered
// outermost-generated -> innermost-source.
const mappersByFilename = new Map<string, Array<StorageMapper>>();

export function registerSourceMappers(
  filename: string,
  mappers: Array<InputMapper>,
): void {
  try {
    const { TraceMap } = getTraceMapping();
    const decoded = mappers.map((map) =>
      isLineOffsetMapper(map) ? map : new TraceMap(map),
    );
    mappersByFilename.set(filename, decoded);
  } catch (err) {
    logger.warn(
      `Failed to register source maps for ${JSON.stringify(filename)}:`,
      err,
    );
    logger.trace(
      `Failed to register source maps for ${JSON.stringify(filename)}:`,
      err,
      { filename, mappers },
    );
  }
}

// line/column are 1-based in and out. trace-mapping uses 0-based columns. null
// means "leave the location unchanged".
export function mapLocation(
  filename: string,
  line: number,
  column: number,
): { filename: string; line: number; column: number } | null {
  const mappersChain = mappersByFilename.get(filename);
  if (mappersChain == null) {
    return null;
  }

  try {
    const { originalPositionFor } = getTraceMapping();

    let currentLine = line;
    let currentColumn = column - 1;
    // The reported location's file path; NOT source code.
    let currentSource: string = filename;

    for (const mapper of mappersChain) {
      if (isLineOffsetMapper(mapper)) {
        currentLine += mapper.lineOffset;
        continue;
      }
      const result = originalPositionFor(mapper, {
        line: currentLine,
        column: currentColumn,
      });
      if (result.line == null || result.source == null) {
        return null;
      }
      currentLine = result.line;
      currentColumn = result.column;
      currentSource = result.source;
    }

    return {
      filename: currentSource,
      line: currentLine,
      column: currentColumn + 1,
    };
  } catch (err) {
    logger.warn(
      "Failed to apply source maps for error stack generation. Failure:",
      err,
    );
    logger.trace(
      "Failed to apply source maps for error stack generation. Failure:",
      err,
      { mappersChain },
    );
    return null;
  }
}
