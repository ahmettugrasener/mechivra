export const DEFLECTED_BEAM_VIEWBOX_WIDTH =
  800;

export const DEFLECTED_BEAM_VIEWBOX_HEIGHT =
  300;

export const DEFLECTED_BEAM_LEFT_X =
  90;

export const DEFLECTED_BEAM_RIGHT_X =
  710;

export const DEFLECTED_BEAM_BASELINE_Y =
  105;

export const DEFLECTED_BEAM_MAX_VISUAL_DEFLECTION_PX =
  82;

export interface DeflectionCurvePoint {
  readonly xM:
    number;

  readonly deflectionM:
    number;
}

export interface DeflectionVisualPoint
  extends DeflectionCurvePoint {
  readonly xPx:
    number;

  readonly yPx:
    number;
}

export interface DeflectedBeamGeometry {
  readonly points:
    readonly DeflectionVisualPoint[];

  readonly path:
    string;

  readonly maximumAbsoluteDeflectionM:
    number;
}

export class DeflectedBeamGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "DeflectedBeamGeometryError";
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
    throw new DeflectedBeamGeometryError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

export function mapBeamXToVisualX(
  xM:
    number,

  spanM:
    number,
): number {
  assertFinitePositive(
    spanM,
    "Beam span",
  );

  if (
    !Number.isFinite(
      xM,
    ) ||
    xM < 0 ||
    xM > spanM
  ) {
    throw new DeflectedBeamGeometryError(
      "Beam position must be finite and lie within the span.",
    );
  }

  return (
    DEFLECTED_BEAM_LEFT_X +
    (
      xM /
      spanM
    ) *
      (
        DEFLECTED_BEAM_RIGHT_X -
        DEFLECTED_BEAM_LEFT_X
      )
  );
}

export function createDeflectedBeamGeometry(
  spanM:
    number,

  curvePoints:
    readonly DeflectionCurvePoint[],
): DeflectedBeamGeometry {
  assertFinitePositive(
    spanM,
    "Beam span",
  );

  if (
    curvePoints.length <
    2
  ) {
    throw new DeflectedBeamGeometryError(
      "Deflection curve requires at least two points.",
    );
  }

  for (
    const point
    of curvePoints
  ) {
    if (
      !Number.isFinite(
        point.xM,
      ) ||
      point.xM < 0 ||
      point.xM > spanM ||
      !Number.isFinite(
        point.deflectionM,
      )
    ) {
      throw new DeflectedBeamGeometryError(
        "Deflection curve contains an invalid point.",
      );
    }
  }

  const maximumAbsoluteDeflectionM =
    Math.max(
      ...curvePoints.map(
        (point) =>
          Math.abs(
            point.deflectionM,
          ),
      ),
    );

  const points =
    curvePoints.map(
      (
        point,
      ): DeflectionVisualPoint => {
        const deflectionRatio =
          maximumAbsoluteDeflectionM ===
          0
            ? 0
            : point.deflectionM /
              maximumAbsoluteDeflectionM;

        return {
          ...point,

          xPx:
            mapBeamXToVisualX(
              point.xM,
              spanM,
            ),

          yPx:
            DEFLECTED_BEAM_BASELINE_Y -
            deflectionRatio *
              DEFLECTED_BEAM_MAX_VISUAL_DEFLECTION_PX,
        };
      },
    );

  const path =
    points
      .map(
        (
          point,
          index,
        ) =>
          `${
            index === 0
              ? "M"
              : "L"
          } ${point.xPx} ${point.yPx}`,
      )
      .join(
        " ",
      );

  return {
    points,
    path,
    maximumAbsoluteDeflectionM,
  };
}

export function interpolateVisualYAtX(
  points:
    readonly DeflectionVisualPoint[],

  xM:
    number,
): number {
  if (
    points.length <
    2
  ) {
    throw new DeflectedBeamGeometryError(
      "At least two visual points are required.",
    );
  }

  if (
    xM <=
    points[0]!.xM
  ) {
    return points[0]!.yPx;
  }

  if (
    xM >=
    points[
      points.length -
      1
    ]!.xM
  ) {
    return points[
      points.length -
      1
    ]!.yPx;
  }

  for (
    let index = 1;
    index <
    points.length;
    index += 1
  ) {
    const left =
      points[
        index - 1
      ]!;

    const right =
      points[
        index
      ]!;

    if (
      xM <=
      right.xM
    ) {
      const ratio =
        (
          xM -
          left.xM
        ) /
        (
          right.xM -
          left.xM
        );

      return (
        left.yPx +
        ratio *
          (
            right.yPx -
            left.yPx
          )
      );
    }
  }

  return points[
    points.length -
    1
  ]!.yPx;
}