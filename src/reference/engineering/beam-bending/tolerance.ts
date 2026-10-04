import type {
  ReferenceTolerance,
} from "@/reference/engineering/beam-bending/types";

export function isWithinBeamBendingReferenceTolerance(
  actual:
    number,

  expected:
    number,

  tolerance:
    ReferenceTolerance,
): boolean {
  if (
    !Number.isFinite(
      actual,
    ) ||
    !Number.isFinite(
      expected,
    ) ||
    !Number.isFinite(
      tolerance.absolute,
    ) ||
    tolerance.absolute < 0 ||
    !Number.isFinite(
      tolerance.relative,
    ) ||
    tolerance.relative < 0
  ) {
    return false;
  }

  const absoluteError =
    Math.abs(
      actual -
      expected,
    );

  const scale =
    Math.max(
      Math.abs(
        actual,
      ),

      Math.abs(
        expected,
      ),
    );

  const allowedError =
    Math.max(
      tolerance.absolute,

      tolerance.relative *
        scale,
    );

  return (
    absoluteError <=
    allowedError
  );
}