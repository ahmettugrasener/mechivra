export interface NumericTolerance {
  readonly absolute:
    number;

  readonly relative:
    number;
}

export interface NumericToleranceEvaluation {
  readonly actual:
    number;

  readonly expected:
    number;

  readonly absoluteDifference:
    number;

  readonly relativeDifference:
    number | null;

  readonly allowedDifference:
    number;

  readonly withinTolerance:
    boolean;
}

export class NumericToleranceError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "NumericToleranceError";
  }
}

function assertFiniteNonNegative(
  value:
    number,

  name:
    string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    throw new NumericToleranceError(
      `${name} must be finite and greater than or equal to zero.`,
    );
  }
}

export function validateNumericTolerance(
  tolerance:
    NumericTolerance,
): void {
  assertFiniteNonNegative(
    tolerance.absolute,
    "Absolute tolerance",
  );

  assertFiniteNonNegative(
    tolerance.relative,
    "Relative tolerance",
  );

  if (
    tolerance.absolute ===
      0 &&
    tolerance.relative ===
      0
  ) {
    throw new NumericToleranceError(
      "At least one numeric tolerance component must be greater than zero.",
    );
  }
}

export function evaluateNumericTolerance(
  actual:
    number,

  expected:
    number,

  tolerance:
    NumericTolerance,
): NumericToleranceEvaluation {
  validateNumericTolerance(
    tolerance,
  );

  if (
    !Number.isFinite(
      actual,
    )
  ) {
    return {
      actual,

      expected,

      absoluteDifference:
        Number.POSITIVE_INFINITY,

      relativeDifference:
        null,

      allowedDifference:
        Math.max(
          tolerance.absolute,

          tolerance.relative *
            Math.abs(
              expected,
            ),
        ),

      withinTolerance:
        false,
    };
  }

  if (
    !Number.isFinite(
      expected,
    )
  ) {
    throw new NumericToleranceError(
      "Expected numeric value must be finite.",
    );
  }

  const absoluteDifference =
    Math.abs(
      actual -
      expected,
    );

  /*
   * Relative difference is undefined at an exact zero
   * reference. The absolute tolerance remains authoritative
   * in that case.
   */
  const relativeDifference =
    expected ===
    0
      ? null
      : absoluteDifference /
        Math.abs(
          expected,
        );

  const allowedDifference =
    Math.max(
      tolerance.absolute,

      tolerance.relative *
        Math.abs(
          expected,
        ),
    );

  return {
    actual,

    expected,

    absoluteDifference,

    relativeDifference,

    allowedDifference,

    withinTolerance:
      absoluteDifference <=
      allowedDifference,
  };
}