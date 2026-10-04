import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateBeamBending,
} from "@/domain/engineering/beam/bending/analysis";

import {
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import {
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering/beam/input";

import {
  beamBendingReferenceCases,
  isWithinBeamBendingReferenceTolerance,
} from "@/reference/engineering/beam-bending";

function createBeamState(
  spanM:
    number,

  pointLoadN:
    number,

  loadPositionM:
    number,
) {
  const stateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            spanM,

          unit:
            "m",
        },

        pointLoad: {
          value:
            pointLoadN,

          unit:
            "N",
        },

        loadPosition: {
          value:
            loadPositionM,

          unit:
            "m",
        },
      },
    );

  if (
    !stateResult.state
  ) {
    throw new Error(
      "Reference case produced an invalid beam state.",
    );
  }

  return stateResult.state;
}

describe(
  "Beam bending independent reference verification",
  () => {
    for (
      const referenceCase
      of beamBendingReferenceCases
    ) {
      it(
        `matches independent benchmark ${referenceCase.id}`,
        () => {
          const configurationResult =
            createBeamBendingConfiguration(
              {
                sectionWidthM:
                  referenceCase
                    .input
                    .sectionWidthM,

                sectionHeightM:
                  referenceCase
                    .input
                    .sectionHeightM,

                elasticModulusPa:
                  referenceCase
                    .input
                    .elasticModulusPa,

                allowableBendingStressPa:
                  referenceCase
                    .input
                    .allowableBendingStressPa,

                allowableDeflectionM:
                  referenceCase
                    .input
                    .allowableDeflectionM,
              },
            );

          if (
            !configurationResult.configuration
          ) {
            throw new Error(
              `Reference configuration "${referenceCase.id}" is invalid.`,
            );
          }

          const result =
            evaluateBeamBending(
              createBeamState(
                referenceCase
                  .input
                  .spanM,

                referenceCase
                  .input
                  .pointLoadN,

                referenceCase
                  .input
                  .loadPositionM,
              ),

              configurationResult
                .configuration,
            );

          if (
            !result.values
          ) {
            throw new Error(
              `Production model failed reference "${referenceCase.id}".`,
            );
          }

          const {
            expected,
            tolerance,
          } =
            referenceCase;

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .maximumMomentNm,

              expected
                .maximumMomentNm,

              tolerance
                .maximumMomentNm,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .section
                .secondMomentAreaM4,

              expected
                .secondMomentAreaM4,

              tolerance
                .secondMomentAreaM4,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .section
                .elasticSectionModulusM3,

              expected
                .elasticSectionModulusM3,

              tolerance
                .elasticSectionModulusM3,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .stress
                .topFiberStressPa,

              expected
                .topFiberStressPa,

              tolerance
                .stressPa,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .stress
                .bottomFiberStressPa,

              expected
                .bottomFiberStressPa,

              tolerance
                .stressPa,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .stress
                .maximumAbsoluteStressPa,

              expected
                .maximumAbsoluteStressPa,

              tolerance
                .stressPa,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .deflection
                .maximumAbsoluteDeflectionM,

              expected
                .maximumAbsoluteDeflectionM,

              tolerance
                .deflectionM,
            ),
          ).toBe(true);

          expect(
            isWithinBeamBendingReferenceTolerance(
              result.values
                .deflection
                .signedDeflectionAtMaximumM,

              expected
                .signedDeflectionAtMaximumM,

              tolerance
                .deflectionM,
            ),
          ).toBe(true);

          const location =
            result.values
              .deflection
              .maximumLocation;

          if (
            location.type !==
            "point"
          ) {
            throw new Error(
              `Reference "${referenceCase.id}" expected a unique maximum-deflection location.`,
            );
          }

          expect(
            isWithinBeamBendingReferenceTolerance(
              location.xM,

              expected
                .maximumDeflectionPositionM,

              tolerance
                .positionM,
            ),
          ).toBe(true);

          expect(
            result.values
              .criteria
              .bendingStress
              .status,
          ).toBe(
            expected
              .bendingStressCriterion,
          );

          expect(
            result.values
              .criteria
              .deflection
              .status,
          ).toBe(
            expected
              .deflectionCriterion,
          );
        },
      );
    }
  },
);