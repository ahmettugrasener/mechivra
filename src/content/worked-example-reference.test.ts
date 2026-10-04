import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering";

import {
  getWorkedExampleDefinition,
} from "@/content/worked-examples";

import {
  eccentricPointLoadReference,
  isWithinReferenceTolerance,
} from "@/reference/engineering/beam-statics";

describe(
  "Statics worked-example reference verification",
  () => {
    it(
      "uses the independently verified A2 physical state",
      () => {
        const definition =
          getWorkedExampleDefinition(
            "activity-ssb-02",
          );

        if (
          !definition ||
          definition.kind !==
            "beam_statics_worked_example"
        ) {
          throw new Error(
            "Expected Statics worked example.",
          );
        }

        expect(
          definition.input.spanM,
        ).toBe(
          eccentricPointLoadReference
            .input.spanM,
        );

        expect(
          definition.input.pointLoadKN *
            1000,
        ).toBe(
          eccentricPointLoadReference
            .input.pointLoadN,
        );

        expect(
          definition.input
            .loadPositionM,
        ).toBe(
          eccentricPointLoadReference
            .input.loadPositionM,
        );
      },
    );

    it(
      "reproduces the independent A2 reaction and maximum-moment values",
      () => {
        const definition =
          getWorkedExampleDefinition(
            "activity-ssb-02",
          );

        if (
          !definition ||
          definition.kind !==
            "beam_statics_worked_example"
        ) {
          throw new Error(
            "Expected Statics worked example.",
          );
        }

        const stateResult =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value:
                  definition.input
                    .spanM,

                unit: "m",
              },

              pointLoad: {
                value:
                  definition.input
                    .pointLoadKN,

                unit: "kN",
              },

              loadPosition: {
                value:
                  definition.input
                    .loadPositionM,

                unit: "m",
              },
            },
          );

        if (
          !stateResult.state
        ) {
          throw new Error(
            "Expected valid worked-example beam state.",
          );
        }

        const result =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid worked-example statics values.",
          );
        }

        expect(
          isWithinReferenceTolerance(
            result.values
              .leftReactionN,
            eccentricPointLoadReference
              .expected
              .leftReactionN,
            eccentricPointLoadReference
              .tolerance,
          ),
        ).toBe(true);

        expect(
          isWithinReferenceTolerance(
            result.values
              .rightReactionN,
            eccentricPointLoadReference
              .expected
              .rightReactionN,
            eccentricPointLoadReference
              .tolerance,
          ),
        ).toBe(true);

        expect(
          isWithinReferenceTolerance(
            result.values.moment
              .maximum.valueNm,
            eccentricPointLoadReference
              .expected
              .maximumMomentNm,
            eccentricPointLoadReference
              .tolerance,
          ),
        ).toBe(true);
      },
    );
  },
);