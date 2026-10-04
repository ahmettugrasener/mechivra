import type {
  RectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

export const BENDING_STRESS_SIGN_CONVENTION = {
  positiveMoment:
    "sagging",

  positiveY:
    "upward_from_neutral_axis",

  positiveNormalStress:
    "tension",

  negativeNormalStress:
    "compression",
} as const;

export interface RectangularBendingStressDistribution {
  readonly momentNm:
    number;

  readonly topFiberYFromNeutralAxisM:
    number;

  readonly bottomFiberYFromNeutralAxisM:
    number;

  readonly topFiberStressPa:
    number;

  readonly neutralAxisStressPa:
    number;

  readonly bottomFiberStressPa:
    number;

  readonly maximumAbsoluteStressPa:
    number;
}

export class BendingStressCalculationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "BendingStressCalculationError";
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

function assertFinite(
  value: number,
  name: string,
): void {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    throw new BendingStressCalculationError(
      `${name} must be finite.`,
    );
  }
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
    throw new BendingStressCalculationError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

export function calculateBendingNormalStressPa(
  momentNm:
    number,

  yFromNeutralAxisM:
    number,

  secondMomentAreaM4:
    number,
): number {
  assertFinite(
    momentNm,
    "Bending moment",
  );

  assertFinite(
    yFromNeutralAxisM,
    "Fiber coordinate",
  );

  assertFinitePositive(
    secondMomentAreaM4,
    "Second moment of area",
  );

  return canonicalizeZero(
    -(
      momentNm *
      yFromNeutralAxisM
    ) /
      secondMomentAreaM4,
  );
}

export function createRectangularBendingStressDistribution(
  momentNm:
    number,

  section:
    RectangularSectionProperties,
): RectangularBendingStressDistribution {
  assertFinite(
    momentNm,
    "Bending moment",
  );

  assertFinitePositive(
    section.secondMomentAreaM4,
    "Second moment of area",
  );

  assertFinitePositive(
    section.extremeFiberDistanceM,
    "Extreme-fiber distance",
  );

  const topFiberYFromNeutralAxisM =
    section.extremeFiberDistanceM;

  const bottomFiberYFromNeutralAxisM =
    -section.extremeFiberDistanceM;

  const topFiberStressPa =
    calculateBendingNormalStressPa(
      momentNm,
      topFiberYFromNeutralAxisM,
      section.secondMomentAreaM4,
    );

  const neutralAxisStressPa =
    calculateBendingNormalStressPa(
      momentNm,
      0,
      section.secondMomentAreaM4,
    );

  const bottomFiberStressPa =
    calculateBendingNormalStressPa(
      momentNm,
      bottomFiberYFromNeutralAxisM,
      section.secondMomentAreaM4,
    );

  const maximumAbsoluteStressPa =
    Math.max(
      Math.abs(
        topFiberStressPa,
      ),

      Math.abs(
        bottomFiberStressPa,
      ),
    );

  return {
    momentNm,

    topFiberYFromNeutralAxisM,

    bottomFiberYFromNeutralAxisM,

    topFiberStressPa,

    neutralAxisStressPa,

    bottomFiberStressPa,

    maximumAbsoluteStressPa,
  };
}