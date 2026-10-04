import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

describe(
  "Beam statics engineering pipeline",
  () => {
    it(
      "runs from user display units to canonical engineering results",
      () => {
        const stateResult =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 2,
                unit: "m",
              },
            },
          );

        expect(
          stateResult.issues,
        ).toEqual([]);

        if (!stateResult.state) {
          throw new Error(
            "Expected a valid canonical beam state.",
          );
        }

        expect(
          stateResult.state,
        ).toMatchObject({
          spanM: 4,
          pointLoadN: 10_000,
          loadPositionM: 2,
        });

        const result =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        expect(
          result.status,
        ).toBe("valid");

        expect(
          result.values,
        ).not.toBeNull();

        if (!result.values) {
          throw new Error(
            "Expected valid statics values.",
          );
        }

        const leftReactionKN =
          fromSI(
            "force",
            result.values.leftReactionN,
            "kN",
          );

        const rightReactionKN =
          fromSI(
            "force",
            result.values.rightReactionN,
            "kN",
          );

        const maximumMomentKNm =
          fromSI(
            "moment",
            result.values.moment.maximum.valueNm,
            "kN_m",
          );

        expect(
          leftReactionKN,
        ).toBeCloseTo(
          5,
          12,
        );

        expect(
          rightReactionKN,
        ).toBeCloseTo(
          5,
          12,
        );

        expect(
          maximumMomentKNm,
        ).toBeCloseTo(
          10,
          12,
        );
      },
    );

    it(
      "produces identical physical results from equivalent display units",
      () => {
        const inputA =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 1,
                unit: "m",
              },
            },
          );

        const inputB =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4000,
                unit: "mm",
              },

              pointLoad: {
                value: 10_000,
                unit: "N",
              },

              loadPosition: {
                value: 100,
                unit: "cm",
              },
            },
          );

        if (
          !inputA.state ||
          !inputB.state
        ) {
          throw new Error(
            "Expected equivalent valid beam states.",
          );
        }

        expect(
          inputA.state,
        ).toEqual(
          inputB.state,
        );

        const resultA =
          beamStaticsModel.evaluate(
            inputA.state,
          );

        const resultB =
          beamStaticsModel.evaluate(
            inputB.state,
          );

        expect(
          resultA,
        ).toEqual(
          resultB,
        );
      },
    );

    it(
      "stops the pipeline before calculation when beam geometry is invalid",
      () => {
        const stateResult =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 4,
                unit: "m",
              },
            },
          );

        expect(
          stateResult.state,
        ).toBeNull();

        expect(
          stateResult.issues,
        ).toHaveLength(1);

        expect(
          stateResult.issues[0],
        ).toMatchObject({
          code:
            "outside_exclusive_range",

          field:
            "loadPositionM",
        });
      },
    );

    it(
      "preserves model identity, model version, and assumptions in a valid result",
      () => {
        const stateResult =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 5,
                unit: "m",
              },

              pointLoad: {
                value: 8,
                unit: "kN",
              },

              loadPosition: {
                value: 2,
                unit: "m",
              },
            },
          );

        if (!stateResult.state) {
          throw new Error(
            "Expected a valid beam state.",
          );
        }

        const result =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        expect(
          result.modelId,
        ).toBe(
          "beam-statics-simply-supported-point-load",
        );

        expect(
          result.modelVersion,
        ).toBe("1.0.0");

        expect(
          result.assumptions,
        ).toContain(
          "beam-statics.two-dimensional",
        );

        expect(
          result.assumptions,
        ).toContain(
          "beam-statics.simply-supported",
        );

        expect(
          result.assumptions,
        ).toContain(
          "beam-statics.single-downward-point-load",
        );

        expect(
          result.validity.withinDomain,
        ).toBe(true);
      },
    );
  },
);