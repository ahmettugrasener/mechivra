import type {
  ReferenceTolerance,
} from "@/reference/engineering/beam-statics/types";

export function isWithinReferenceTolerance(
  actual: number,
  expected: number,
  tolerance: ReferenceTolerance,
): boolean {
  if (
    !Number.isFinite(actual) ||
    !Number.isFinite(expected)
  ) {
    return false;
  }

  const absoluteError =
    Math.abs(
      actual -
      expected,
    );

  const relativeScale =
    Math.max(
      Math.abs(expected),
      Math.abs(actual),
    );

  const allowedError =
    Math.max(
      tolerance.absolute,
      tolerance.relative *
        relativeScale,
    );

  return (
    absoluteError <=
    allowedError
  );
}