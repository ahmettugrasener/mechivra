export const BEAM_SCENE_VIEWBOX_WIDTH =
  800;

export const BEAM_SCENE_VIEWBOX_HEIGHT =
  300;

export const BEAM_SCENE_LEFT_X =
  100;

export const BEAM_SCENE_RIGHT_X =
  700;

export const BEAM_SCENE_Y =
  115;

export const BEAM_SCENE_WIDTH =
  BEAM_SCENE_RIGHT_X -
  BEAM_SCENE_LEFT_X;

export interface BeamSceneGeometry {
  readonly beamLeftX:
    number;

  readonly beamRightX:
    number;

  readonly beamY:
    number;

  readonly loadX:
    number;

  readonly loadPositionRatio:
    number;
}

export class BeamSceneGeometryError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "BeamSceneGeometryError";
  }
}

export function createBeamSceneGeometry(
  spanM: number,
  loadPositionM: number,
): BeamSceneGeometry {
  if (
    !Number.isFinite(
      spanM,
    ) ||
    spanM <= 0
  ) {
    throw new BeamSceneGeometryError(
      "Beam scene span must be a finite positive number.",
    );
  }

  if (
    !Number.isFinite(
      loadPositionM,
    ) ||
    loadPositionM < 0 ||
    loadPositionM > spanM
  ) {
    throw new BeamSceneGeometryError(
      "Beam scene load position must satisfy 0 <= a <= L.",
    );
  }

  const loadPositionRatio =
    loadPositionM /
    spanM;

  const loadX =
    BEAM_SCENE_LEFT_X +
    BEAM_SCENE_WIDTH *
      loadPositionRatio;

  return {
    beamLeftX:
      BEAM_SCENE_LEFT_X,

    beamRightX:
      BEAM_SCENE_RIGHT_X,

    beamY:
      BEAM_SCENE_Y,

    loadX,

    loadPositionRatio,
  };
}