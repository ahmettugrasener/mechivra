export const MOMENT_DIAGRAM_WIDTH =
  800;

export const MOMENT_DIAGRAM_HEIGHT =
  270;

export const MOMENT_DIAGRAM_LEFT_X =
  80;

export const MOMENT_DIAGRAM_RIGHT_X =
  720;

export const MOMENT_DIAGRAM_ZERO_Y =
  190;

export const MOMENT_DIAGRAM_MAX_AMPLITUDE =
  105;

export interface MomentDiagramGeometry {
  readonly xLeft:
    number;

  readonly xRight:
    number;

  readonly xMaximum:
    number;

  readonly zeroY:
    number;

  readonly maximumMomentY:
    number;

  readonly maximumPositionRatio:
    number;
}

export class MomentDiagramGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "MomentDiagramGeometryError";
  }
}

export function createMomentDiagramGeometry(
  spanM: number,
  maximumMomentPositionM: number,
  maximumMomentKNm: number,
): MomentDiagramGeometry {
  if (
    !Number.isFinite(
      spanM,
    ) ||
    spanM <= 0
  ) {
    throw new MomentDiagramGeometryError(
      "Moment diagram span must be a finite positive number.",
    );
  }

  if (
    !Number.isFinite(
      maximumMomentPositionM,
    ) ||
    maximumMomentPositionM < 0 ||
    maximumMomentPositionM >
      spanM
  ) {
    throw new MomentDiagramGeometryError(
      "Maximum-moment position must satisfy 0 <= x <= L.",
    );
  }

  if (
    !Number.isFinite(
      maximumMomentKNm,
    ) ||
    maximumMomentKNm < 0
  ) {
    throw new MomentDiagramGeometryError(
      "Maximum moment must be a finite non-negative number.",
    );
  }

  const maximumPositionRatio =
    maximumMomentPositionM /
    spanM;

  const xMaximum =
    MOMENT_DIAGRAM_LEFT_X +
    (
      MOMENT_DIAGRAM_RIGHT_X -
      MOMENT_DIAGRAM_LEFT_X
    ) *
      maximumPositionRatio;

  const maximumMomentY =
    maximumMomentKNm === 0
      ? MOMENT_DIAGRAM_ZERO_Y
      : MOMENT_DIAGRAM_ZERO_Y -
        MOMENT_DIAGRAM_MAX_AMPLITUDE;

  return {
    xLeft:
      MOMENT_DIAGRAM_LEFT_X,

    xRight:
      MOMENT_DIAGRAM_RIGHT_X,

    xMaximum,

    zeroY:
      MOMENT_DIAGRAM_ZERO_Y,

    maximumMomentY,

    maximumPositionRatio,
  };
}