import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRectangularSectionProperties,
  RectangularSectionGeometryError,
} from "@/domain/engineering/beam/bending/section";

describe(
  "Rectangular bending section",
  () => {
    it(
      "calculates area, centroid, I, c, and elastic section modulus",
      () => {
        const properties =
          createRectangularSectionProperties(
            {
              kind:
                "rectangular",

              widthM:
                0.1,

              heightM:
                0.2,
            },
          );

        expect(
          properties.areaM2,
        ).toBeCloseTo(
          0.02,
          12,
        );

        expect(
          properties.centroidFromBottomM,
        ).toBeCloseTo(
          0.1,
          12,
        );

        expect(
          properties.extremeFiberDistanceM,
        ).toBeCloseTo(
          0.1,
          12,
        );

        expect(
          properties.secondMomentAreaM4,
        ).toBeCloseTo(
          0.00006666666666666668,
          12,
        );

        expect(
          properties.elasticSectionModulusM3,
        ).toBeCloseTo(
          0.0006666666666666668,
          12,
        );
      },
    );

    it(
      "scales second moment of area linearly with width",
      () => {
        const base =
          createRectangularSectionProperties(
            {
              kind:
                "rectangular",

              widthM:
                0.1,

              heightM:
                0.2,
            },
          );

        const doubledWidth =
          createRectangularSectionProperties(
            {
              kind:
                "rectangular",

              widthM:
                0.2,

              heightM:
                0.2,
            },
          );

        expect(
          doubledWidth.areaM2 /
            base.areaM2,
        ).toBeCloseTo(
          2,
          12,
        );

        expect(
          doubledWidth
            .secondMomentAreaM4 /
            base.secondMomentAreaM4,
        ).toBeCloseTo(
          2,
          12,
        );

        expect(
          doubledWidth
            .elasticSectionModulusM3 /
            base.elasticSectionModulusM3,
        ).toBeCloseTo(
          2,
          12,
        );
      },
    );

    it(
      "scales second moment of area with the cube of height",
      () => {
        const base =
          createRectangularSectionProperties(
            {
              kind:
                "rectangular",

              widthM:
                0.1,

              heightM:
                0.2,
            },
          );

        const doubledHeight =
          createRectangularSectionProperties(
            {
              kind:
                "rectangular",

              widthM:
                0.1,

              heightM:
                0.4,
            },
          );

        expect(
          doubledHeight.areaM2 /
            base.areaM2,
        ).toBeCloseTo(
          2,
          12,
        );

        expect(
          doubledHeight
            .secondMomentAreaM4 /
            base.secondMomentAreaM4,
        ).toBeCloseTo(
          8,
          12,
        );

        expect(
          doubledHeight
            .elasticSectionModulusM3 /
            base.elasticSectionModulusM3,
        ).toBeCloseTo(
          4,
          12,
        );
      },
    );

    it(
      "produces the same result deterministically",
      () => {
        const section = {
          kind:
            "rectangular" as const,

          widthM:
            0.08,

          heightM:
            0.16,
        };

        expect(
          createRectangularSectionProperties(
            section,
          ),
        ).toEqual(
          createRectangularSectionProperties(
            section,
          ),
        );
      },
    );

    it(
      "rejects zero width",
      () => {
        expect(
          () =>
            createRectangularSectionProperties(
              {
                kind:
                  "rectangular",

                widthM:
                  0,

                heightM:
                  0.2,
              },
            ),
        ).toThrow(
          RectangularSectionGeometryError,
        );
      },
    );

    it(
      "rejects negative height",
      () => {
        expect(
          () =>
            createRectangularSectionProperties(
              {
                kind:
                  "rectangular",

                widthM:
                  0.1,

                heightM:
                  -0.2,
              },
            ),
        ).toThrow(
          RectangularSectionGeometryError,
        );
      },
    );

    it(
      "rejects non-finite geometry",
      () => {
        expect(
          () =>
            createRectangularSectionProperties(
              {
                kind:
                  "rectangular",

                widthM:
                  Number.POSITIVE_INFINITY,

                heightM:
                  0.2,
              },
            ),
        ).toThrow(
          RectangularSectionGeometryError,
        );

        expect(
          () =>
            createRectangularSectionProperties(
              {
                kind:
                  "rectangular",

                widthM:
                  0.1,

                heightM:
                  Number.NaN,
              },
            ),
        ).toThrow(
          RectangularSectionGeometryError,
        );
      },
    );
  },
);