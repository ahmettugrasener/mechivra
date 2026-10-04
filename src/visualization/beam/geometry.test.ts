import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BEAM_SCENE_LEFT_X,
  BEAM_SCENE_RIGHT_X,
  BeamSceneGeometryError,
  createBeamSceneGeometry,
} from "@/visualization/beam/geometry";

describe(
  "Beam scene geometry",
  () => {
    it(
      "places a centered load at the center of the visual beam",
      () => {
        const geometry =
          createBeamSceneGeometry(
            4,
            2,
          );

        expect(
          geometry.loadPositionRatio,
        ).toBe(0.5);

        expect(
          geometry.loadX,
        ).toBe(400);
      },
    );

    it(
      "maps a quarter-span load to a quarter of the visual beam",
      () => {
        const geometry =
          createBeamSceneGeometry(
            4,
            1,
          );

        expect(
          geometry.loadPositionRatio,
        ).toBe(0.25);

        expect(
          geometry.loadX,
        ).toBe(250);
      },
    );

    it(
      "maps the beam endpoints exactly",
      () => {
        expect(
          createBeamSceneGeometry(
            4,
            0,
          ).loadX,
        ).toBe(
          BEAM_SCENE_LEFT_X,
        );

        expect(
          createBeamSceneGeometry(
            4,
            4,
          ).loadX,
        ).toBe(
          BEAM_SCENE_RIGHT_X,
        );
      },
    );

    it(
      "rejects invalid beam geometry",
      () => {
        expect(
          () =>
            createBeamSceneGeometry(
              0,
              0,
            ),
        ).toThrow(
          BeamSceneGeometryError,
        );

        expect(
          () =>
            createBeamSceneGeometry(
              4,
              5,
            ),
        ).toThrow(
          BeamSceneGeometryError,
        );

        expect(
          () =>
            createBeamSceneGeometry(
              4,
              Number.NaN,
            ),
        ).toThrow(
          BeamSceneGeometryError,
        );
      },
    );
  },
);