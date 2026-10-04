import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createOttoWorkedExampleSnapshot,
} from "@/features/learning/otto/otto-worked-example-adapter";

describe(
  "Otto worked example adapter",
  () => {
    it(
      "reproduces the verified reference cycle",
      () => {
        const result =
          createOttoWorkedExampleSnapshot();

        expect(
          result.states
            .state2
            .temperatureK,
        ).toBeCloseTo(
          689.2190129982209,
          8,
        );

        expect(
          result.states
            .state3
            .temperatureK,
        ).toBeCloseTo(
          1804.2015913954333,
          8,
        );

        expect(
          result.states
            .state4
            .temperatureK,
        ).toBeCloseTo(
          785.3243558445291,
          8,
        );

        expect(
          result
            .heatRejectedKJPerKg,
        ).toBeCloseTo(
          348.2202253184497,
          9,
        );

        expect(
          result
            .netWorkKJPerKg,
        ).toBeCloseTo(
          451.7797746815503,
          9,
        );

        expect(
          result
            .thermalEfficiencyPercent,
        ).toBeCloseTo(
          56.47247183519378,
          10,
        );
      },
    );

    it(
      "keeps both efficiency calculations consistent",
      () => {
        const result =
          createOttoWorkedExampleSnapshot();

        expect(
          result
            .thermalEfficiencyPercent,
        ).toBeCloseTo(
          result
            .thermalEfficiencyFromCompressionRatioPercent,
          10,
        );
      },
    );
  },
);