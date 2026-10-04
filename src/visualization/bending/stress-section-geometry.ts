export const STRESS_SECTION_VIEWBOX_WIDTH =
  800;

export const STRESS_SECTION_VIEWBOX_HEIGHT =
  420;

export const STRESS_SECTION_CENTER_X =
  240;

export const STRESS_SECTION_CENTER_Y =
  190;

export const STRESS_SECTION_PIXELS_PER_METER =
  700;

export const STRESS_AXIS_X =
  560;

export const STRESS_MAX_VISUAL_WIDTH =
  130;

export type StressSign =
  | "tension"
  | "compression"
  | "neutral";

export interface StressSectionGeometry {
  readonly sectionLeftX:
    number;

  readonly sectionRightX:
    number;

  readonly sectionTopY:
    number;

  readonly sectionBottomY:
    number;

  readonly sectionWidthPx:
    number;

  readonly sectionHeightPx:
    number;

  readonly neutralAxisY:
    number;

  readonly stressAxisX:
    number;

  readonly topStressX:
    number;

  readonly bottomStressX:
    number;

  readonly topStressSign:
    StressSign;

  readonly bottomStressSign:
    StressSign;

  readonly maximumAbsoluteStress:
    number;
}

export class StressSectionGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "StressSectionGeometryError";
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
    throw new StressSectionGeometryError(
      `${name} must be finite and greater than zero.`,
    );
  }
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
    throw new StressSectionGeometryError(
      `${name} must be finite.`,
    );
  }
}

function classifyStress(
  stress:
    number,
): StressSign {
  if (
    stress > 0
  ) {
    return "tension";
  }

  if (
    stress < 0
  ) {
    return "compression";
  }

  return "neutral";
}

export function createStressSectionGeometry(
  widthM:
    number,

  heightM:
    number,

  topStress:
    number,

  bottomStress:
    number,
): StressSectionGeometry {
  assertFinitePositive(
    widthM,
    "Section width",
  );

  assertFinitePositive(
    heightM,
    "Section height",
  );

  assertFinite(
    topStress,
    "Top-fiber stress",
  );

  assertFinite(
    bottomStress,
    "Bottom-fiber stress",
  );

  /*
   * Keep one visual physical scale across interactive states.
   *
   * This is intentionally NOT normalized separately for each
   * section. Therefore, increasing b or h produces a directly
   * comparable change in the drawn section dimensions.
   */
  const sectionWidthPx =
    widthM *
    STRESS_SECTION_PIXELS_PER_METER;

  const sectionHeightPx =
    heightM *
    STRESS_SECTION_PIXELS_PER_METER;

  const sectionLeftX =
    STRESS_SECTION_CENTER_X -
    sectionWidthPx /
      2;

  const sectionRightX =
    STRESS_SECTION_CENTER_X +
    sectionWidthPx /
      2;

  const sectionTopY =
    STRESS_SECTION_CENTER_Y -
    sectionHeightPx /
      2;

  const sectionBottomY =
    STRESS_SECTION_CENTER_Y +
    sectionHeightPx /
      2;

  const maximumAbsoluteStress =
    Math.max(
      Math.abs(
        topStress,
      ),

      Math.abs(
        bottomStress,
      ),
    );

  /*
   * Stress amplitude remains normalized to the current stress
   * state. The UI explicitly states that MPa values, rather than
   * this horizontal visual length, are authoritative.
   */
  const topStressX =
    maximumAbsoluteStress ===
    0
      ? STRESS_AXIS_X
      : STRESS_AXIS_X +
        (
          topStress /
          maximumAbsoluteStress
        ) *
          STRESS_MAX_VISUAL_WIDTH;

  const bottomStressX =
    maximumAbsoluteStress ===
    0
      ? STRESS_AXIS_X
      : STRESS_AXIS_X +
        (
          bottomStress /
          maximumAbsoluteStress
        ) *
          STRESS_MAX_VISUAL_WIDTH;

  return {
    sectionLeftX,

    sectionRightX,

    sectionTopY,

    sectionBottomY,

    sectionWidthPx,

    sectionHeightPx,

    neutralAxisY:
      STRESS_SECTION_CENTER_Y,

    stressAxisX:
      STRESS_AXIS_X,

    topStressX,

    bottomStressX,

    topStressSign:
      classifyStress(
        topStress,
      ),

    bottomStressSign:
      classifyStress(
        bottomStress,
      ),

    maximumAbsoluteStress,
  };
}