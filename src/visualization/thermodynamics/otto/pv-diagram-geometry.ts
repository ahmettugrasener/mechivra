import type {
  IdealOttoPvPoint,
  IdealOttoPvProcessCurve,
} from "@/domain/engineering/thermodynamics/otto";

export const OTTO_PV_VIEWBOX_WIDTH =
  800;

export const OTTO_PV_VIEWBOX_HEIGHT =
  500;

export const OTTO_PV_PLOT_LEFT =
  95;

export const OTTO_PV_PLOT_RIGHT =
  745;

export const OTTO_PV_PLOT_TOP =
  45;

export const OTTO_PV_PLOT_BOTTOM =
  410;

export interface IdealOttoPvVisualPoint {
  readonly x:
    number;

  readonly y:
    number;

  readonly physical:
    IdealOttoPvPoint;
}

export interface IdealOttoPvVisualCurve {
  readonly processId:
    IdealOttoPvProcessCurve["processId"];

  readonly kind:
    IdealOttoPvProcessCurve["kind"];

  readonly points:
    readonly IdealOttoPvVisualPoint[];

  readonly svgPoints:
    string;
}

export interface IdealOttoPvDiagramGeometry {
  readonly maximumSpecificVolumeM3PerKg:
    number;

  readonly maximumPressurePa:
    number;

  readonly curves:
    readonly IdealOttoPvVisualCurve[];

  readonly states: {
    readonly state1:
      IdealOttoPvVisualPoint;

    readonly state2:
      IdealOttoPvVisualPoint;

    readonly state3:
      IdealOttoPvVisualPoint;

    readonly state4:
      IdealOttoPvVisualPoint;
  };
}

export class IdealOttoPvDiagramGeometryError extends Error {
  constructor(
    message:
      string,
  ) {
    super(message);

    this.name =
      "IdealOttoPvDiagramGeometryError";
  }
}

function mapPoint(
  point:
    IdealOttoPvPoint,

  maximumSpecificVolumeM3PerKg:
    number,

  maximumPressurePa:
    number,
): IdealOttoPvVisualPoint {
  const plotWidth =
    OTTO_PV_PLOT_RIGHT -
    OTTO_PV_PLOT_LEFT;

  const plotHeight =
    OTTO_PV_PLOT_BOTTOM -
    OTTO_PV_PLOT_TOP;

  return {
    x:
      OTTO_PV_PLOT_LEFT +
      (
        point.specificVolumeM3PerKg /
        maximumSpecificVolumeM3PerKg
      ) *
        plotWidth,

    y:
      OTTO_PV_PLOT_BOTTOM -
      (
        point.pressurePa /
        maximumPressurePa
      ) *
        plotHeight,

    physical:
      point,
  };
}

function requireCurve(
  curves:
    readonly IdealOttoPvProcessCurve[],

  processId:
    IdealOttoPvProcessCurve["processId"],
): IdealOttoPvProcessCurve {
  const curve =
    curves.find(
      (candidate) =>
        candidate.processId ===
        processId,
    );

  if (!curve) {
    throw new IdealOttoPvDiagramGeometryError(
      `Missing ${processId}.`,
    );
  }

  return curve;
}

function firstPoint(
  curve:
    IdealOttoPvProcessCurve,
): IdealOttoPvPoint {
  const point =
    curve.points[0];

  if (!point) {
    throw new IdealOttoPvDiagramGeometryError(
      `${curve.processId} contains no points.`,
    );
  }

  return point;
}

function lastPoint(
  curve:
    IdealOttoPvProcessCurve,
): IdealOttoPvPoint {
  const point =
    curve.points.at(
      -1,
    );

  if (!point) {
    throw new IdealOttoPvDiagramGeometryError(
      `${curve.processId} contains no points.`,
    );
  }

  return point;
}

export function createIdealOttoPvDiagramGeometry(
  curves:
    readonly IdealOttoPvProcessCurve[],
): IdealOttoPvDiagramGeometry {
  if (
    curves.length !==
    4
  ) {
    throw new IdealOttoPvDiagramGeometryError(
      "Ideal Otto p-v diagram requires four process curves.",
    );
  }

  const physicalPoints =
    curves.flatMap(
      (curve) =>
        curve.points,
    );

  if (
    physicalPoints.length ===
    0
  ) {
    throw new IdealOttoPvDiagramGeometryError(
      "Ideal Otto p-v diagram requires process points.",
    );
  }

  for (
    const point
    of physicalPoints
  ) {
    if (
      !Number.isFinite(
        point.specificVolumeM3PerKg,
      ) ||
      point.specificVolumeM3PerKg <=
        0 ||
      !Number.isFinite(
        point.pressurePa,
      ) ||
      point.pressurePa <=
        0
    ) {
      throw new IdealOttoPvDiagramGeometryError(
        "All p-v points must contain finite positive physical values.",
      );
    }
  }

  /*
   * The diagram uses a zero-origin quantitative scale with a
   * small headroom margin. The physics is already contained
   * in the supplied process points.
   */
  const maximumSpecificVolumeM3PerKg =
    Math.max(
      ...physicalPoints.map(
        (point) =>
          point.specificVolumeM3PerKg,
      ),
    ) *
    1.08;

  const maximumPressurePa =
    Math.max(
      ...physicalPoints.map(
        (point) =>
          point.pressurePa,
      ),
    ) *
    1.08;

  const visualCurves =
    curves.map(
      (curve) => {
        const points =
          curve.points.map(
            (point) =>
              mapPoint(
                point,
                maximumSpecificVolumeM3PerKg,
                maximumPressurePa,
              ),
          );

        return {
          processId:
            curve.processId,

          kind:
            curve.kind,

          points,

          svgPoints:
            points
              .map(
                (point) =>
                  `${point.x},${point.y}`,
              )
              .join(
                " ",
              ),
        };
      },
    );

  const curve12 =
    requireCurve(
      curves,
      "process-1-2",
    );

  const curve23 =
    requireCurve(
      curves,
      "process-2-3",
    );

  const curve34 =
    requireCurve(
      curves,
      "process-3-4",
    );

  return {
    maximumSpecificVolumeM3PerKg,

    maximumPressurePa,

    curves:
      visualCurves,

    states: {
      state1:
        mapPoint(
          firstPoint(
            curve12,
          ),
          maximumSpecificVolumeM3PerKg,
          maximumPressurePa,
        ),

      state2:
        mapPoint(
          lastPoint(
            curve12,
          ),
          maximumSpecificVolumeM3PerKg,
          maximumPressurePa,
        ),

      state3:
        mapPoint(
          lastPoint(
            curve23,
          ),
          maximumSpecificVolumeM3PerKg,
          maximumPressurePa,
        ),

      state4:
        mapPoint(
          lastPoint(
            curve34,
          ),
          maximumSpecificVolumeM3PerKg,
          maximumPressurePa,
        ),
    },
  };
}