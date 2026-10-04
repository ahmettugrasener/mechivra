import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamBendingReferenceCases,
  centeredPointLoadReference,
  deepSectionReference,
  eccentricPointLoadReference,
  reducedElasticModulusReference,
} from "@/reference/engineering/beam-bending";

describe(
  "Beam bending independent reference cases",
  () => {
    it(
      "contains four uniquely identified benchmark cases",
      () => {
        expect(
          beamBendingReferenceCases,
        ).toHaveLength(4);

        const ids =
          beamBendingReferenceCases.map(
            (referenceCase) =>
              referenceCase.id,
          );

        expect(
          new Set(
            ids,
          ).size,
        ).toBe(
          ids.length,
        );
      },
    );

    it(
      "stores source traceability and a documented independent method",
      () => {
        for (
          const referenceCase
          of beamBendingReferenceCases
        ) {
          expect(
            referenceCase
              .referenceMethod
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            referenceCase
              .sourceIds.length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            referenceCase.sourceIds,
          ).toContain(
            "source-mit-beam-displacements",
          );
        }
      },
    );

    it(
      "captures the centered-load closed-form benchmark",
      () => {
        expect(
          centeredPointLoadReference
            .expected
            .maximumMomentNm,
        ).toBe(
          10_000,
        );

        expect(
          centeredPointLoadReference
            .expected
            .maximumAbsoluteStressPa,
        ).toBe(
          15_000_000,
        );

        expect(
          centeredPointLoadReference
            .expected
            .maximumAbsoluteDeflectionM,
        ).toBe(
          0.001,
        );

        expect(
          centeredPointLoadReference
            .expected
            .maximumDeflectionPositionM,
        ).toBe(
          2,
        );
      },
    );

    it(
      "captures that maximum deflection does not coincide with the load for the eccentric benchmark",
      () => {
        expect(
          eccentricPointLoadReference
            .expected
            .maximumDeflectionPositionM,
        ).toBeCloseTo(
          1.7639320225002102,
          12,
        );

        expect(
          eccentricPointLoadReference
            .expected
            .maximumDeflectionPositionM,
        ).not.toBe(
          eccentricPointLoadReference
            .input
            .loadPositionM,
        );
      },
    );

    it(
      "captures the independent elastic-modulus scaling benchmark",
      () => {
        expect(
          reducedElasticModulusReference
            .expected
            .maximumMomentNm,
        ).toBe(
          centeredPointLoadReference
            .expected
            .maximumMomentNm,
        );

        expect(
          reducedElasticModulusReference
            .expected
            .maximumAbsoluteStressPa,
        ).toBe(
          centeredPointLoadReference
            .expected
            .maximumAbsoluteStressPa,
        );

        expect(
          reducedElasticModulusReference
            .expected
            .maximumAbsoluteDeflectionM,
        ).toBe(
          2 *
            centeredPointLoadReference
              .expected
              .maximumAbsoluteDeflectionM,
        );
      },
    );

    it(
      "captures the independent height-scaling benchmark",
      () => {
        expect(
          deepSectionReference
            .expected
            .secondMomentAreaM4,
        ).toBeCloseTo(
          8 *
            centeredPointLoadReference
              .expected
              .secondMomentAreaM4,
          14,
        );

        expect(
          deepSectionReference
            .expected
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          centeredPointLoadReference
            .expected
            .maximumAbsoluteStressPa /
            4,
          8,
        );

        expect(
          deepSectionReference
            .expected
            .maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          centeredPointLoadReference
            .expected
            .maximumAbsoluteDeflectionM /
            8,
          12,
        );
      },
    );
  },
);