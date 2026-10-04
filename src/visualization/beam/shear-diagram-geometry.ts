export const SHEAR_DIAGRAM_WIDTH =
  800;

export const SHEAR_DIAGRAM_HEIGHT =
  250;

export const SHEAR_DIAGRAM_LEFT_X =
  80;

export const SHEAR_DIAGRAM_RIGHT_X =
  720;

export const SHEAR_DIAGRAM_ZERO_Y =
  120;

export const SHEAR_DIAGRAM_MAX_AMPLITUDE =
  72;

export interface ShearDiagramGeometry {
  readonly xLeft:
    number;

  readonly xRight:
    number;

  readonly xLoad:
    number;

  readonly zeroY:
    number;

  readonly leftShearY:
    number;

  readonly rightShearY:
    number;

  readonly loadPositionRatio:
    number;

  readonly maximumAbsoluteShearKN:
    number;
}

export class ShearDiagramGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "ShearDiagramGeometryError";
  }
}

function mapShearToY(
  shearKN: number,
  maximumAbsoluteShearKN: number,
): number {
  if (
    maximumAbsoluteShearKN === 0
  ) {
    return SHEAR_DIAGRAM_ZERO_Y;
  }

  return (
    SHEAR_DIAGRAM_ZERO_Y -
    (
      shearKN /
      maximumAbsoluteShearKN
    ) *
      SHEAR_DIAGRAM_MAX_AMPLITUDE
  );
}

export function createShearDiagramGeometry(
  spanM: number,
  loadPositionM: number,
  leftShearKN: number,
  rightShearKN: number,
): ShearDiagramGeometry {
  if (
    !Number.isFinite(
      spanM,
    ) ||
    spanM <= 0
  ) {
    throw new ShearDiagramGeometryError(
      "Shear diagram span must be a finite positive number.",
    );
  }

  if (
    !Number.isFinite(
      loadPositionM,
    ) ||
    loadPositionM < 0 ||
    loadPositionM > spanM
  ) {
    throw new ShearDiagramGeometryError(
      "Shear diagram load position must satisfy 0 <= a <= L.",
    );
  }

  if (
    !Number.isFinite(
      leftShearKN,
    ) ||
    !Number.isFinite(
      rightShearKN,
    )
  ) {
    throw new ShearDiagramGeometryError(
      "Shear values must be finite.",
    );
  }

  const loadPositionRatio =
    loadPositionM /
    spanM;

  const xLoad =
    SHEAR_DIAGRAM_LEFT_X +
    (
      SHEAR_DIAGRAM_RIGHT_X -
      SHEAR_DIAGRAM_LEFT_X
    ) *
      loadPositionRatio;

  const maximumAbsoluteShearKN =
    Math.max(
      Math.abs(
        leftShearKN,
      ),
      Math.abs(
        rightShearKN,
      ),
    );

  return {
    xLeft:
      SHEAR_DIAGRAM_LEFT_X,

    xRight:
      SHEAR_DIAGRAM_RIGHT_X,

    xLoad,

    zeroY:
      SHEAR_DIAGRAM_ZERO_Y,

    leftShearY:
      mapShearToY(
        leftShearKN,
        maximumAbsoluteShearKN,
      ),

    rightShearY:
      mapShearToY(
        rightShearKN,
        maximumAbsoluteShearKN,
      ),

    loadPositionRatio,

    maximumAbsoluteShearKN,
  };
}