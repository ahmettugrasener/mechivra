import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto/analysis";

import {
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

function createInput(
  compressionRatio:
    number = 8,

  heatInputJPerKg:
    number = 800_000,
) {
  const result =
    createIdealOttoInputState(
      {
        compressionRatio,

        initialTemperatureK:
          300,

        initialPressurePa:
          100_000,

        heatInputJPerKg,
      },
    );

  if (
    !result.state
  ) {
    throw new Error(
      "Expected valid Ideal Otto input state.",
    );
  }

  return result.state;
}

describe(
  "Complete Ideal Otto cycle analysis",
  () => {
    it(
      "reproduces the report energy-performance reference",
      () => {
        const result =
          evaluateIdealOttoCycle(
            createInput(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analysis.",
          );
        }

        expect(
          result.values
            .energy
            .heatInputJPerKg,
        ).toBeCloseTo(
          800_000,
          8,
        );

        expect(
          result.values
            .energy
            .heatRejectedJPerKg,
        ).toBeCloseTo(
          348_220.2253184497,
          5,
        );

        expect(
          result.values
            .energy
            .netWorkJPerKg,
        ).toBeCloseTo(
          451_779.7746815503,
          5,
        );

        expect(
          result.values
            .energy
            .thermalEfficiencyFromEnergyBalance,
        ).toBeCloseTo(
          0.5647247183519378,
          12,
        );
      },
    );

    it(
      "returns all four thermodynamic states together with energy performance",
      () => {
        const result =
          evaluateIdealOttoCycle(
            createInput(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analysis.",
          );
        }

        expect(
          result.values
            .states
            .state1
            .temperatureK,
        ).toBeCloseTo(
          300,
          10,
        );

        expect(
          result.values
            .states
            .state3
            .temperatureK,
        ).toBeCloseTo(
          1804.2015913954333,
          8,
        );

        expect(
          result.values
            .energy
            .netWorkJPerKg,
        ).toBeGreaterThan(
          0,
        );
      },
    );

    it(
      "keeps ideal efficiency unchanged when qin changes at fixed r and gamma",
      () => {
        const highHeat =
          evaluateIdealOttoCycle(
            createInput(
              8,
              800_000,
            ),
          );

        const lowHeat =
          evaluateIdealOttoCycle(
            createInput(
              8,
              400_000,
            ),
          );

        if (
          !highHeat.values ||
          !lowHeat.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analyses.",
          );
        }

        expect(
          lowHeat.values
            .energy
            .thermalEfficiencyFromEnergyBalance,
        ).toBeCloseTo(
          highHeat.values
            .energy
            .thermalEfficiencyFromEnergyBalance,
          12,
        );

        expect(
          lowHeat.values
            .energy
            .thermalEfficiencyFromCompressionRatio,
        ).toBeCloseTo(
          highHeat.values
            .energy
            .thermalEfficiencyFromCompressionRatio,
          12,
        );
      },
    );

    it(
      "changes temperatures and work when qin changes",
      () => {
        const highHeat =
          evaluateIdealOttoCycle(
            createInput(
              8,
              800_000,
            ),
          );

        const lowHeat =
          evaluateIdealOttoCycle(
            createInput(
              8,
              400_000,
            ),
          );

        if (
          !highHeat.values ||
          !lowHeat.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analyses.",
          );
        }

        expect(
          lowHeat.values
            .states.state3
            .temperatureK,
        ).toBeLessThan(
          highHeat.values
            .states.state3
            .temperatureK,
        );

        expect(
          lowHeat.values
            .energy
            .netWorkJPerKg,
        ).toBeCloseTo(
          highHeat.values
            .energy
            .netWorkJPerKg /
            2,
          8,
        );

        expect(
          lowHeat.values
            .energy
            .heatRejectedJPerKg,
        ).toBeCloseTo(
          highHeat.values
            .energy
            .heatRejectedJPerKg /
            2,
          8,
        );
      },
    );

    it(
      "increases ideal efficiency when compression ratio increases",
      () => {
        const r8 =
          evaluateIdealOttoCycle(
            createInput(
              8,
            ),
          );

        const r10 =
          evaluateIdealOttoCycle(
            createInput(
              10,
            ),
          );

        if (
          !r8.values ||
          !r10.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analyses.",
          );
        }

        expect(
          r10.values
            .energy
            .thermalEfficiencyFromCompressionRatio,
        ).toBeGreaterThan(
          r8.values
            .energy
            .thermalEfficiencyFromCompressionRatio,
        );

        expect(
          r10.values
            .energy
            .thermalEfficiencyFromEnergyBalance,
        ).toBeGreaterThan(
          r8.values
            .energy
            .thermalEfficiencyFromEnergyBalance,
        );
      },
    );

    it(
      "keeps both internal consistency residuals essentially zero",
      () => {
        const result =
          evaluateIdealOttoCycle(
            createInput(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto analysis.",
          );
        }

        expect(
          result.values
            .energy
            .energyBalanceResidualJPerKg,
        ).toBeCloseTo(
          0,
          12,
        );

        expect(
          result.values
            .energy
            .efficiencyResidual,
        ).toBeCloseTo(
          0,
          12,
        );
      },
    );

    it(
      "returns invalid when given a forged invalid canonical input",
      () => {
        const forged = {
          ...createInput(),

          heatInputJPerKg:
            0,
        };

        const result =
          evaluateIdealOttoCycle(
            forged,
          );

        expect(
          result.status,
        ).toBe(
          "invalid",
        );

        expect(
          result.values,
        ).toBeNull();

        expect(
          result.issues.length,
        ).toBeGreaterThan(
          0,
        );
      },
    );

    it(
      "is deterministic",
      () => {
        const input =
          createInput();

        const first =
          evaluateIdealOttoCycle(
            input,
          );

        const second =
          evaluateIdealOttoCycle(
            input,
          );

        expect(
          second,
        ).toEqual(
          first,
        );
      },
    );
  },
);