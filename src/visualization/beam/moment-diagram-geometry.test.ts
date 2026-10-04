import {
  describe,
  expect,
  it,
} from "vitest";

import {
  MOMENT_DIAGRAM_LEFT_X,
  MOMENT_DIAGRAM_RIGHT_X,
  MOMENT_DIAGRAM_ZERO_Y,
  MomentDiagramGeometryError,
  createMomentDiagramGeometry,
} from "@/visualization/beam/moment-diagram-geometry";

describe(
  "Moment diagram geometry",
  () => {
    it(
      "places a centered maximum at the center of the diagram",
      () => {
        const geometry =
          createMomentDiagramGeometry(
            4,
            2,
            10,
          );

        expect(
          geometry.maximumPositionRatio,
        ).toBe(0.5);

        expect(
          geometry.xMaximum,
        ).toBe(400);

        expect(
          geometry.maximumMomentY,
        ).toBeLessThan(
          MOMENT_DIAGRAM_ZERO_Y,
        );
      },
    );

    it(
      "moves the maximum-moment point with the point load",
      () => {
        const geometry =
          createMomentDiagramGeometry(
            4,
            3,
            7.5,
          );

        expect(
          geometry.maximumPositionRatio,
        ).toBe(0.75);

        expect(
          geometry.xMaximum,
        ).toBe(560);
      },
    );

    it(
      "maps endpoint positions exactly",
      () => {
        expect(
          createMomentDiagramGeometry(
            4,
            0,
            0,
          ).xMaximum,
        ).toBe(
          MOMENT_DIAGRAM_LEFT_X,
        );

        expect(
          createMomentDiagramGeometry(
            4,
            4,
            0,
          ).xMaximum,
        ).toBe(
          MOMENT_DIAGRAM_RIGHT_X,
        );
      },
    );

    it(
      "keeps a zero moment state on the zero axis",
      () => {
        const geometry =
          createMomentDiagramGeometry(
            4,
            2,
            0,
          );

        expect(
          geometry.maximumMomentY,
        ).toBe(
          MOMENT_DIAGRAM_ZERO_Y,
        );
      },
    );

    it(
      "rejects invalid inputs",
      () => {
        expect(
          () =>
            createMomentDiagramGeometry(
              0,
              0,
              0,
            ),
        ).toThrow(
          MomentDiagramGeometryError,
        );

        expect(
          () =>
            createMomentDiagramGeometry(
              4,
              5,
              10,
            ),
        ).toThrow(
          MomentDiagramGeometryError,
        );

        expect(
          () =>
            createMomentDiagramGeometry(
              4,
              2,
              -1,
            ),
        ).toThrow(
          MomentDiagramGeometryError,
        );

        expect(
          () =>
            createMomentDiagramGeometry(
              4,
              2,
              Number.NaN,
            ),
        ).toThrow(
          MomentDiagramGeometryError,
        );
      },
    );
  },
);