import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BENDING_CONFIGURATION_VERSION,
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

describe(
  "Beam bending configuration",
  () => {
    it(
      "creates a valid rectangular linear-elastic configuration",
      () => {
        const result =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0.1,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                200e9,

              allowableBendingStressPa:
                250e6,

              allowableDeflectionM:
                0.01,
            },
          );

        expect(
          result.issues,
        ).toEqual([]);

        expect(
          result.configuration,
        ).toEqual({
          configurationVersion:
            BENDING_CONFIGURATION_VERSION,

          section: {
            kind:
              "rectangular",

            widthM:
              0.1,

            heightM:
              0.2,
          },

          material: {
            kind:
              "linear_elastic",

            elasticModulusPa:
              200e9,

            allowableBendingStressPa:
              250e6,
          },

          criteria: {
            allowableDeflectionM:
              0.01,
          },
        });
      },
    );

    it(
      "allows engineering limits to remain undefined",
      () => {
        const result =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0.1,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                200e9,
            },
          );

        expect(
          result.issues,
        ).toEqual([]);

        expect(
          result.configuration
            ?.material
            .allowableBendingStressPa,
        ).toBeNull();

        expect(
          result.configuration
            ?.criteria
            .allowableDeflectionM,
        ).toBeNull();
      },
    );

    it(
      "rejects invalid section dimensions",
      () => {
        const result =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0,

              sectionHeightM:
                -0.2,

              elasticModulusPa:
                200e9,
            },
          );

        expect(
          result.configuration,
        ).toBeNull();

        expect(
          result.issues.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual([
          "invalid_section_width",
          "invalid_section_height",
        ]);
      },
    );

    it(
      "rejects non-finite or non-positive elastic modulus",
      () => {
        const zeroResult =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0.1,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                0,
            },
          );

        expect(
          zeroResult.configuration,
        ).toBeNull();

        expect(
          zeroResult.issues[0]
            ?.code,
        ).toBe(
          "invalid_elastic_modulus",
        );

        const infiniteResult =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0.1,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                Number.POSITIVE_INFINITY,
            },
          );

        expect(
          infiniteResult.configuration,
        ).toBeNull();

        expect(
          infiniteResult.issues[0]
            ?.code,
        ).toBe(
          "invalid_elastic_modulus",
        );
      },
    );

    it(
      "rejects invalid optional stress and deflection limits",
      () => {
        const result =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                0.1,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                200e9,

              allowableBendingStressPa:
                -1,

              allowableDeflectionM:
                0,
            },
          );

        expect(
          result.configuration,
        ).toBeNull();

        expect(
          result.issues.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual([
          "invalid_allowable_bending_stress",
          "invalid_allowable_deflection",
        ]);
      },
    );

    it(
      "rejects NaN section input deterministically",
      () => {
        const first =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                Number.NaN,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                200e9,
            },
          );

        const second =
          createBeamBendingConfiguration(
            {
              sectionWidthM:
                Number.NaN,

              sectionHeightM:
                0.2,

              elasticModulusPa:
                200e9,
            },
          );

        expect(
          first,
        ).toEqual(
          second,
        );

        expect(
          first.configuration,
        ).toBeNull();

        expect(
          first.issues[0]
            ?.code,
        ).toBe(
          "invalid_section_width",
        );
      },
    );
  },
);