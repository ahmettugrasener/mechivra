import {
  describe,
  expect,
  it,
} from "vitest";

import {
  SHEAR_DIAGRAM_LEFT_X,
  SHEAR_DIAGRAM_RIGHT_X,
  SHEAR_DIAGRAM_ZERO_Y,
  ShearDiagramGeometryError,
  createShearDiagramGeometry,
} from "@/visualization/beam/shear-diagram-geometry";

describe(
  "Shear diagram geometry",
  () => {
    it(
      "places a centered-load discontinuity at the center of the diagram",
      () => {
        const geometry =
          createShearDiagramGeometry(
            4,
            2,
            5,
            -5,
          );

        expect(
          geometry.loadPositionRatio,
        ).toBe(0.5);

        expect(
          geometry.xLoad,
        ).toBe(400);

        expect(
          geometry.leftShearY,
        ).toBeLessThan(
          SHEAR_DIAGRAM_ZERO_Y,
        );

        expect(
          geometry.rightShearY,
        ).toBeGreaterThan(
          SHEAR_DIAGRAM_ZERO_Y,
        );
      },
    );

    it(
      "moves the discontinuity with the point load",
      () => {
        const geometry =
          createShearDiagramGeometry(
            4,
            3,
            2.5,
            -7.5,
          );

        expect(
          geometry.loadPositionRatio,
        ).toBe(0.75);

        expect(
          geometry.xLoad,
        ).toBe(560);
      },
    );

    it(
      "maps the beam endpoints exactly",
      () => {
        expect(
          createShearDiagramGeometry(
            4,
            0,
            10,
            0,
          ).xLoad,
        ).toBe(
          SHEAR_DIAGRAM_LEFT_X,
        );

        expect(
          createShearDiagramGeometry(
            4,
            4,
            0,
            -10,
          ).xLoad,
        ).toBe(
          SHEAR_DIAGRAM_RIGHT_X,
        );
      },
    );

    it(
      "keeps a zero-load shear diagram on the zero axis",
      () => {
        const geometry =
          createShearDiagramGeometry(
            4,
            2,
            0,
            0,
          );

        expect(
          geometry.maximumAbsoluteShearKN,
        ).toBe(0);

        expect(
          geometry.leftShearY,
        ).toBe(
          SHEAR_DIAGRAM_ZERO_Y,
        );

        expect(
          geometry.rightShearY,
        ).toBe(
          SHEAR_DIAGRAM_ZERO_Y,
        );
      },
    );

    it(
      "normalizes unequal shear magnitudes using the larger absolute value",
      () => {
        const geometry =
          createShearDiagramGeometry(
            4,
            3,
            2.5,
            -7.5,
          );

        expect(
          geometry.maximumAbsoluteShearKN,
        ).toBe(7.5);

        expect(
          Math.abs(
            geometry.rightShearY -
              SHEAR_DIAGRAM_ZERO_Y,
          ),
        ).toBeGreaterThan(
          Math.abs(
            geometry.leftShearY -
              SHEAR_DIAGRAM_ZERO_Y,
          ),
        );
      },
    );

    it(
      "rejects invalid diagram inputs",
      () => {
        expect(
          () =>
            createShearDiagramGeometry(
              0,
              0,
              0,
              0,
            ),
        ).toThrow(
          ShearDiagramGeometryError,
        );

        expect(
          () =>
            createShearDiagramGeometry(
              4,
              5,
              5,
              -5,
            ),
        ).toThrow(
          ShearDiagramGeometryError,
        );

        expect(
          () =>
            createShearDiagramGeometry(
              4,
              2,
              Number.NaN,
              -5,
            ),
        ).toThrow(
          ShearDiagramGeometryError,
        );
      },
    );
  },
);