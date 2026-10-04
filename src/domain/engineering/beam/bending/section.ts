import type {
  RectangularSectionState,
} from "@/domain/engineering/beam/bending/state";

export interface RectangularSectionProperties {
  readonly areaM2:
    number;

  readonly centroidFromBottomM:
    number;

  readonly extremeFiberDistanceM:
    number;

  readonly secondMomentAreaM4:
    number;

  readonly elasticSectionModulusM3:
    number;
}

export class RectangularSectionGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "RectangularSectionGeometryError";
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
    throw new RectangularSectionGeometryError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

export function createRectangularSectionProperties(
  section:
    RectangularSectionState,
): RectangularSectionProperties {
  assertFinitePositive(
    section.widthM,
    "Section width",
  );

  assertFinitePositive(
    section.heightM,
    "Section height",
  );

  const areaM2 =
    section.widthM *
    section.heightM;

  const centroidFromBottomM =
    section.heightM /
    2;

  const extremeFiberDistanceM =
    section.heightM /
    2;

  const secondMomentAreaM4 =
    (
      section.widthM *
      section.heightM ** 3
    ) /
    12;

  const elasticSectionModulusM3 =
    secondMomentAreaM4 /
    extremeFiberDistanceM;

  return {
    areaM2,
    centroidFromBottomM,
    extremeFiberDistanceM,
    secondMomentAreaM4,
    elasticSectionModulusM3,
  };
}