import type {
  ReferenceTolerance,
} from "@/reference/engineering/ideal-otto/types";

export function isWithinIdealOttoReferenceTolerance(
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
    )
  ) {
    return false;
  }

  const allowedDifference =
    Math.max(
      tolerance.absolute,

      tolerance.relative *
        Math.max(
          Math.abs(
            actual,
          ),

          Math.abs(
            expected,
          ),
        ),
    );

  return (
    Math.abs(
      actual -
      expected,
    ) <=
    allowedDifference
  );
}