import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsReferenceCases,
  centeredPointLoadReference,
  eccentricPointLoadReference,
  isWithinReferenceTolerance,
} from "@/reference/engineering/beam-statics";

describe(
  "Independent beam statics reference cases",
  () => {
    it(
      "contains two independent MVP reference cases",
      () => {
        expect(
          beamStaticsReferenceCases,
        ).toHaveLength(2);
      },
    );

    it(
      "uses unique reference IDs",
      () => {
        const ids =
          beamStaticsReferenceCases.map(
            (referenceCase) =>
              referenceCase.id,
          );

        expect(
          new Set(ids).size,
        ).toBe(ids.length);
      },
    );

    it(
      "stores the centered-load Appendix A1 values explicitly",
      () => {
        expect(
          centeredPointLoadReference.input,
        ).toEqual({
          spanM: 4,
          pointLoadN:
            10_000,
          loadPositionM: 2,
        });

        expect(
          centeredPointLoadReference.expected.leftReactionN,
        ).toBe(5_000);

        expect(
          centeredPointLoadReference.expected.rightReactionN,
        ).toBe(5_000);

        expect(
          centeredPointLoadReference.expected.maximumMomentNm,
        ).toBe(10_000);

        expect(
          centeredPointLoadReference.expected.maximumMomentPositionM,
        ).toBe(2);

        expect(
          centeredPointLoadReference.expected.shear,
        ).toEqual({
          leftOfLoadN: 5_000,
          rightOfLoadN: -5_000,
        });

        expect(
          centeredPointLoadReference.expected.momentPoints,
        ).toEqual([
          {
            xM: 0,
            expectedMomentNm: 0,
          },
          {
            xM: 2,
            expectedMomentNm:
              10_000,
          },
          {
            xM: 4,
            expectedMomentNm: 0,
          },
        ]);
      },
    );

    it(
      "stores the eccentric-load Appendix A2 values explicitly",
      () => {
        expect(
          eccentricPointLoadReference.input,
        ).toEqual({
          spanM: 4,
          pointLoadN:
            10_000,
          loadPositionM: 1,
        });

        expect(
          eccentricPointLoadReference.expected.leftReactionN,
        ).toBe(7_500);

        expect(
          eccentricPointLoadReference.expected.rightReactionN,
        ).toBe(2_500);

        expect(
          eccentricPointLoadReference.expected.maximumMomentNm,
        ).toBe(7_500);

        expect(
          eccentricPointLoadReference.expected.maximumMomentPositionM,
        ).toBe(1);
      },
    );

    it(
      "records a scientific source for every reference case",
      () => {
        for (
          const referenceCase
          of beamStaticsReferenceCases
        ) {
          expect(
            referenceCase.sourceIds.length,
          ).toBeGreaterThan(0);

          expect(
            referenceCase.sourceIds,
          ).toContain(
            "source-mit-beam-displacements",
          );
        }
      },
    );

    it(
      "accepts an exact reference result",
      () => {
        expect(
          isWithinReferenceTolerance(
            5_000,
            5_000,
            centeredPointLoadReference.tolerance,
          ),
        ).toBe(true);
      },
    );

    it(
      "accepts a very small floating-point deviation",
      () => {
        expect(
          isWithinReferenceTolerance(
            5_000 +
              1e-10,
            5_000,
            centeredPointLoadReference.tolerance,
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a meaningful engineering deviation",
      () => {
        expect(
          isWithinReferenceTolerance(
            5_001,
            5_000,
            centeredPointLoadReference.tolerance,
          ),
        ).toBe(false);
      },
    );

    it(
      "handles a zero expected value with absolute tolerance",
      () => {
        expect(
          isWithinReferenceTolerance(
            5e-10,
            0,
            centeredPointLoadReference.tolerance,
          ),
        ).toBe(true);

        expect(
          isWithinReferenceTolerance(
            1e-4,
            0,
            centeredPointLoadReference.tolerance,
          ),
        ).toBe(false);
      },
    );
  },
);