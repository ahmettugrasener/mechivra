export const BEAM_DEFLECTION_SIGN_CONVENTION = {
  positiveVerticalDirection:
    "upward",

  downwardDeflectionSign:
    "negative",
} as const;

export interface SimplySupportedPointLoadDeflectionInput {
  readonly spanM:
    number;

  readonly pointLoadN:
    number;

  readonly loadPositionM:
    number;

  readonly elasticModulusPa:
    number;

  readonly secondMomentAreaM4:
    number;
}

export type DeflectionMaximumLocation =
  | {
      readonly type:
        "point";

      readonly xM:
        number;
    }
  | {
      readonly type:
        "interval";

      readonly startM:
        number;

      readonly endM:
        number;
    };

export interface SimplySupportedPointLoadDeflectionResult {
  readonly maximumAbsoluteDeflectionM:
    number;

  readonly signedDeflectionAtMaximumM:
    number;

  readonly maximumLocation:
    DeflectionMaximumLocation;
}

export class BeamDeflectionCalculationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "BeamDeflectionCalculationError";
  }
}

function canonicalizeZero(
  value: number,
): number {
  return Object.is(
    value,
    -0,
  )
    ? 0
    : value;
}

function assertFinitePositive(
  value: number,
  name: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <= 0
  ) {
    throw new BeamDeflectionCalculationError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

function assertFiniteNonNegative(
  value: number,
  name: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    throw new BeamDeflectionCalculationError(
      `${name} must be finite and greater than or equal to zero.`,
    );
  }
}

function validateInput(
  input:
    SimplySupportedPointLoadDeflectionInput,
): void {
  assertFinitePositive(
    input.spanM,
    "Beam span",
  );

  assertFiniteNonNegative(
    input.pointLoadN,
    "Point load",
  );

  if (
    !Number.isFinite(
      input.loadPositionM,
    ) ||
    input.loadPositionM <= 0 ||
    input.loadPositionM >=
      input.spanM
  ) {
    throw new BeamDeflectionCalculationError(
      "Load position must be finite and strictly between the two supports.",
    );
  }

  assertFinitePositive(
    input.elasticModulusPa,
    "Elastic modulus",
  );

  assertFinitePositive(
    input.secondMomentAreaM4,
    "Second moment of area",
  );
}

export function calculateSimplySupportedPointLoadDeflectionAtX(
  input:
    SimplySupportedPointLoadDeflectionInput,

  xM:
    number,
): number {
  validateInput(
    input,
  );

  if (
    !Number.isFinite(
      xM,
    ) ||
    xM < 0 ||
    xM > input.spanM
  ) {
    throw new BeamDeflectionCalculationError(
      "Evaluation position must be finite and lie within the beam span.",
    );
  }

  if (
    input.pointLoadN ===
    0
  ) {
    return 0;
  }

  const L =
    input.spanM;

  const P =
    input.pointLoadN;

  const a =
    input.loadPositionM;

  const b =
    L - a;

  const EI =
    input.elasticModulusPa *
    input.secondMomentAreaM4;

  let deflectionM:
    number;

  if (
    xM <= a
  ) {
    deflectionM =
      -(
        P *
        b *
        xM *
        (
          L ** 2 -
          b ** 2 -
          xM ** 2
        )
      ) /
      (
        6 *
        L *
        EI
      );
  } else {
    const distanceFromRightSupportM =
      L - xM;

    deflectionM =
      -(
        P *
        a *
        distanceFromRightSupportM *
        (
          L ** 2 -
          a ** 2 -
          distanceFromRightSupportM ** 2
        )
      ) /
      (
        6 *
        L *
        EI
      );
  }

  return canonicalizeZero(
    deflectionM,
  );
}

export function createSimplySupportedPointLoadDeflection(
  input:
    SimplySupportedPointLoadDeflectionInput,
): SimplySupportedPointLoadDeflectionResult {
  validateInput(
    input,
  );

  if (
    input.pointLoadN ===
    0
  ) {
    return {
      maximumAbsoluteDeflectionM:
        0,

      signedDeflectionAtMaximumM:
        0,

      maximumLocation: {
        type:
          "interval",

        startM:
          0,

        endM:
          input.spanM,
      },
    };
  }

  const L =
    input.spanM;

  const a =
    input.loadPositionM;

  let maximumPositionM:
    number;

  if (
    a <=
    L / 2
  ) {
    maximumPositionM =
      L -
      Math.sqrt(
        (
          L ** 2 -
          a ** 2
        ) /
          3,
      );
  } else {
    const b =
      L - a;

    maximumPositionM =
      Math.sqrt(
        (
          L ** 2 -
          b ** 2
        ) /
          3,
      );
  }

  const signedDeflectionAtMaximumM =
    calculateSimplySupportedPointLoadDeflectionAtX(
      input,
      maximumPositionM,
    );

  return {
    maximumAbsoluteDeflectionM:
      Math.abs(
        signedDeflectionAtMaximumM,
      ),

    signedDeflectionAtMaximumM,

    maximumLocation: {
      type:
        "point",

      xM:
        maximumPositionM,
    },
  };
}