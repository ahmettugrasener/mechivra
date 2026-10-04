import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DEFLECTED_BEAM_BASELINE_Y,
  DEFLECTED_BEAM_LEFT_X,
  DEFLECTED_BEAM_RIGHT_X,
  createDeflectedBeamGeometry,
  mapBeamXToVisualX,
} from "@/visualization/bending/deflected-beam-geometry";

describe(
  "Deflected beam visualization geometry",
  () => {
    it(
      "maps the two supports to the visual beam endpoints",
      () => {
        expect(
          mapBeamXToVisualX(
            0,
            4,
          ),
        ).toBe(
          DEFLECTED_BEAM_LEFT_X,
        );

        expect(
          mapBeamXToVisualX(
            4,
            4,
          ),
        ).toBe(
          DEFLECTED_BEAM_RIGHT_X,
        );
      },
    );

    it(
      "keeps zero-deflection support points on the baseline",
      () => {
        const geometry =
          createDeflectedBeamGeometry(
            4,
            [
              {
                xM:
                  0,

                deflectionM:
                  0,
              },

              {
                xM:
                  2,

                deflectionM:
                  -0.001,
              },

              {
                xM:
                  4,

                deflectionM:
                  0,
              },
            ],
          );

        expect(
          geometry.points[0]
            ?.yPx,
        ).toBe(
          DEFLECTED_BEAM_BASELINE_Y,
        );

        expect(
          geometry.points[2]
            ?.yPx,
        ).toBe(
          DEFLECTED_BEAM_BASELINE_Y,
        );
      },
    );

    it(
      "draws negative physical deflection downward on the screen",
      () => {
        const geometry =
          createDeflectedBeamGeometry(
            4,
            [
              {
                xM:
                  0,

                deflectionM:
                  0,
              },

              {
                xM:
                  2,

                deflectionM:
                  -0.001,
              },

              {
                xM:
                  4,

                deflectionM:
                  0,
              },
            ],
          );

        expect(
          geometry.points[1]
            ?.yPx,
        ).toBeGreaterThan(
          DEFLECTED_BEAM_BASELINE_Y,
        );
      },
    );

    it(
      "normalizes visual amplitude without changing physical data",
      () => {
        const first =
          createDeflectedBeamGeometry(
            4,
            [
              {
                xM:
                  0,

                deflectionM:
                  0,
              },

              {
                xM:
                  2,

                deflectionM:
                  -0.001,
              },

              {
                xM:
                  4,

                deflectionM:
                  0,
              },
            ],
          );

        const second =
          createDeflectedBeamGeometry(
            4,
            [
              {
                xM:
                  0,

                deflectionM:
                  0,
              },

              {
                xM:
                  2,

                deflectionM:
                  -0.002,
              },

              {
                xM:
                  4,

                deflectionM:
                  0,
              },
            ],
          );

        expect(
          first.points[1]
            ?.yPx,
        ).toBe(
          second.points[1]
            ?.yPx,
        );

        expect(
          first.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          0.001,
          12,
        );

        expect(
          second.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          0.002,
          12,
        );
      },
    );
  },
);