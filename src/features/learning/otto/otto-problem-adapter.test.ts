import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createOttoProblemDefinition,
} from "@/features/learning/otto/otto-problem-adapter";

describe(
  "Otto problem adapter",
  () => {
    it(
      "matches the independently verified alternate-state reference",
      () => {
        const problem =
          createOttoProblemDefinition();

        expect(
          problem.expected
            .state2TemperatureK,
        ).toBeCloseTo(
          655.25520354535,
          8,
        );

        expect(
          problem.expected
            .state3TemperatureK,
        ).toBeCloseTo(
          1491.4921373432594,
          8,
        );

        expect(
          problem.expected
            .state4TemperatureK,
        ).toBeCloseTo(
          728.3841186875989,
          8,
        );

        expect(
          problem.expected
            .heatRejectedKJPerKg,
        ).toBeCloseTo(
          293.01560515835223,
          9,
        );

        expect(
          problem.expected
            .netWorkKJPerKg,
        ).toBeCloseTo(
          306.98439484164777,
          9,
        );

        expect(
          problem.expected
            .thermalEfficiencyPercent,
        ).toBeCloseTo(
          51.1640658069413,
          10,
        );
      },
    );
  },
);