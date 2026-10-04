import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateOttoInteractiveState,
} from "@/features/learning/otto/otto-interactive-adapter";

describe(
  "Otto interactive adapter",
  () => {
    it(
      "reproduces the reference r8 qin800 cycle",
      () => {
        const result =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                8,

              heatInputKJPerKg:
                800,
            },
          );

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
          result.netWorkKJPerKg,
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
      "increasing compression ratio increases ideal efficiency",
      () => {
        const r8 =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                8,

              heatInputKJPerKg:
                800,
            },
          );

        const r10 =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                10,

              heatInputKJPerKg:
                800,
            },
          );

        expect(
          r10
            .thermalEfficiencyPercent,
        ).toBeCloseTo(
          60.18928294465027,
          10,
        );

        expect(
          r10
            .thermalEfficiencyPercent,
        ).toBeGreaterThan(
          r8
            .thermalEfficiencyPercent,
        );

        expect(
          r10.states
            .state2
            .pressureKPa,
        ).toBeGreaterThan(
          r8.states
            .state2
            .pressureKPa,
        );
      },
    );

    it(
      "changing qin at fixed r changes temperatures and work but not ideal efficiency",
      () => {
        const highHeat =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                8,

              heatInputKJPerKg:
                800,
            },
          );

        const lowHeat =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                8,

              heatInputKJPerKg:
                400,
            },
          );

        expect(
          lowHeat.states
            .state3
            .temperatureK,
        ).toBeCloseTo(
          1246.7103021968271,
          8,
        );

        expect(
          lowHeat.netWorkKJPerKg,
        ).toBeCloseTo(
          225.8898873407752,
          9,
        );

        expect(
          lowHeat
            .thermalEfficiencyPercent,
        ).toBeCloseTo(
          highHeat
            .thermalEfficiencyPercent,
          10,
        );
      },
    );

    it(
      "provides four synchronized p-v process curves",
      () => {
        const result =
          evaluateOttoInteractiveState(
            {
              compressionRatio:
                8,

              heatInputKJPerKg:
                800,
            },
          );

        expect(
          result.curves,
        ).toHaveLength(4);

        expect(
          result.curves.map(
            (curve) =>
              curve.processId,
          ),
        ).toEqual([
          "process-1-2",
          "process-2-3",
          "process-3-4",
          "process-4-1",
        ]);
      },
    );
  },
);