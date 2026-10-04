import {
  describe,
  expect,
  it,
} from "vitest";

import {
  STRESS_AXIS_X,
  createStressSectionGeometry,
  StressSectionGeometryError,
} from "@/visualization/bending/stress-section-geometry";

describe(
  "Stress-section visualization geometry",
  () => {
    it(
      "preserves the rectangular section aspect ratio",
      () => {
        const geometry =
          createStressSectionGeometry(
            0.1,
            0.2,
            -15,
            15,
          );

        expect(
          geometry.sectionHeightPx /
            geometry.sectionWidthPx,
        ).toBeCloseTo(
          2,
          12,
        );

        expect(
          geometry.neutralAxisY,
        ).toBeCloseTo(
          (
            geometry.sectionTopY +
            geometry.sectionBottomY
          ) /
            2,
          12,
        );
      },
    );

    it(
      "uses one comparable visual scale across section states",
      () => {
        const base =
          createStressSectionGeometry(
            0.1,
            0.2,
            -15,
            15,
          );

        const doubledWidth =
          createStressSectionGeometry(
            0.2,
            0.2,
            -7.5,
            7.5,
          );

        const doubledHeight =
          createStressSectionGeometry(
            0.1,
            0.4,
            -3.75,
            3.75,
          );

        expect(
          doubledWidth
            .sectionWidthPx,
        ).toBeCloseTo(
          2 *
            base.sectionWidthPx,
          12,
        );

        expect(
          doubledWidth
            .sectionHeightPx,
        ).toBeCloseTo(
          base.sectionHeightPx,
          12,
        );

        expect(
          doubledHeight
            .sectionHeightPx,
        ).toBeCloseTo(
          2 *
            base.sectionHeightPx,
          12,
        );

        expect(
          doubledHeight
            .sectionWidthPx,
        ).toBeCloseTo(
          base.sectionWidthPx,
          12,
        );
      },
    );

    it(
      "places compression left and tension right of the stress axis",
      () => {
        const geometry =
          createStressSectionGeometry(
            0.1,
            0.2,
            -15,
            15,
          );

        expect(
          geometry.topStressX,
        ).toBeLessThan(
          STRESS_AXIS_X,
        );

        expect(
          geometry.bottomStressX,
        ).toBeGreaterThan(
          STRESS_AXIS_X,
        );

        expect(
          geometry.topStressSign,
        ).toBe(
          "compression",
        );

        expect(
          geometry.bottomStressSign,
        ).toBe(
          "tension",
        );
      },
    );

    it(
      "reverses the visual stress direction when stress signs reverse",
      () => {
        const geometry =
          createStressSectionGeometry(
            0.1,
            0.2,
            15,
            -15,
          );

        expect(
          geometry.topStressX,
        ).toBeGreaterThan(
          STRESS_AXIS_X,
        );

        expect(
          geometry.bottomStressX,
        ).toBeLessThan(
          STRESS_AXIS_X,
        );

        expect(
          geometry.topStressSign,
        ).toBe(
          "tension",
        );

        expect(
          geometry.bottomStressSign,
        ).toBe(
          "compression",
        );
      },
    );

    it(
      "collapses zero stress onto the stress axis",
      () => {
        const geometry =
          createStressSectionGeometry(
            0.1,
            0.2,
            0,
            0,
          );

        expect(
          geometry.topStressX,
        ).toBe(
          STRESS_AXIS_X,
        );

        expect(
          geometry.bottomStressX,
        ).toBe(
          STRESS_AXIS_X,
        );

        expect(
          geometry.topStressSign,
        ).toBe(
          "neutral",
        );

        expect(
          geometry.bottomStressSign,
        ).toBe(
          "neutral",
        );
      },
    );

    it(
      "rejects invalid section dimensions and non-finite stresses",
      () => {
        expect(
          () =>
            createStressSectionGeometry(
              0,
              0.2,
              -15,
              15,
            ),
        ).toThrow(
          StressSectionGeometryError,
        );

        expect(
          () =>
            createStressSectionGeometry(
              0.1,
              -0.2,
              -15,
              15,
            ),
        ).toThrow(
          StressSectionGeometryError,
        );

        expect(
          () =>
            createStressSectionGeometry(
              0.1,
              0.2,
              Number.NaN,
              15,
            ),
        ).toThrow(
          StressSectionGeometryError,
        );
      },
    );
  },
);