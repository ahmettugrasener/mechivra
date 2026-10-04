import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering";

describe(
  "Beam statics unit invariance",
  () => {
    it(
      "produces identical statics results from equivalent display units",
      () => {
        const metricMetres =
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

        const metricMixed =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 400,
                unit: "cm",
              },

              pointLoad: {
                value: 10_000,
                unit: "N",
              },

              loadPosition: {
                value: 1000,
                unit: "mm",
              },
            },
          );

        if (
          !metricMetres.state ||
          !metricMixed.state
        ) {
          throw new Error(
            "Expected equivalent valid beam states.",
          );
        }

        const resultA =
          beamStaticsModel.evaluate(
            metricMetres.state,
          );

        const resultB =
          beamStaticsModel.evaluate(
            metricMixed.state,
          );

        expect(
          resultA.status,
        ).toBe("valid");

        expect(
          resultB.status,
        ).toBe("valid");

        expect(
          resultA.values,
        ).not.toBeNull();

        expect(
          resultB.values,
        ).not.toBeNull();

        if (
          !resultA.values ||
          !resultB.values
        ) {
          throw new Error(
            "Expected valid statics results.",
          );
        }

        expect(
          resultA.values,
        ).toEqual(
          resultB.values,
        );
      },
    );
  },
);