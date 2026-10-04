import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import {
  IdealOttoEnergyCalculationError,
  calculateIdealOttoEnergyPerformance,
  calculateIdealOttoHeatRejectedJPerKg,
  calculateIdealOttoThermalEfficiencyFromCompressionRatio,
} from "@/domain/engineering/thermodynamics/otto/energy";

import {
  evaluateIdealOttoFourStateCycle,
} from "@/domain/engineering/thermodynamics/otto/model";

import {
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

function createReferenceCycle() {
  const inputResult =
    createIdealOttoInputState(
      {
        compressionRatio:
          8,

        initialTemperatureK:
          300,

        initialPressurePa:
          100_000,

        heatInputJPerKg:
          800_000,
      },
    );

  if (
    !inputResult.state
  ) {
    throw new Error(
      "Expected valid Ideal Otto reference input.",
    );
  }

  const cycle =
    evaluateIdealOttoFourStateCycle(
      inputResult.state,
    );

  if (
    !cycle.values
  ) {
    throw new Error(
      "Expected valid Ideal Otto reference cycle.",
    );
  }

  return {
    inputState:
      inputResult.state,

    cycle:
      cycle.values,
  };
}

describe(
  "Ideal Otto energy performance",
  () => {
    it(
      "reproduces the report heat-rejection reference value",
      () => {
        const {
          cycle,
        } =
          createReferenceCycle();

        const qOut =
          calculateIdealOttoHeatRejectedJPerKg(
            cycle.states
              .state1
              .temperatureK,

            cycle.states
              .state4
              .temperatureK,

            cycle.gasProperties
              .cvJPerKgK,
          );

        expect(
          qOut,
        ).toBeCloseTo(
          348_220.2253184497,
          6,
        );
      },
    );

    it(
      "reproduces the report compression-ratio efficiency",
      () => {
        const efficiency =
          calculateIdealOttoThermalEfficiencyFromCompressionRatio(
            8,
            1.4,
          );

        expect(
          efficiency,
        ).toBeCloseTo(
          0.5647247183519379,
          12,
        );
      },
    );

    it(
      "reproduces qout, net work, and both efficiency calculations",
      () => {
        const {
          inputState,
          cycle,
        } =
          createReferenceCycle();

        const performance =
          calculateIdealOttoEnergyPerformance(
            {
              state1:
                cycle.states
                  .state1,

              state4:
                cycle.states
                  .state4,

              heatInputJPerKg:
                inputState
                  .heatInputJPerKg,

              compressionRatio:
                inputState
                  .compressionRatio,

              gasProperties:
                cycle
                  .gasProperties,
            },
          );

        expect(
          performance
            .heatRejectedJPerKg,
        ).toBeCloseTo(
          348_220.2253184497,
          6,
        );

        expect(
          performance
            .netWorkJPerKg,
        ).toBeCloseTo(
          451_779.7746815503,
          6,
        );

        expect(
          performance
            .thermalEfficiencyFromEnergyBalance,
        ).toBeCloseTo(
          0.5647247183519378,
          12,
        );

        expect(
          performance
            .thermalEfficiencyFromCompressionRatio,
        ).toBeCloseTo(
          0.5647247183519379,
          12,
        );
      },
    );

    it(
      "closes the specific-energy balance",
      () => {
        const {
          inputState,
          cycle,
        } =
          createReferenceCycle();

        const performance =
          calculateIdealOttoEnergyPerformance(
            {
              state1:
                cycle.states.state1,

              state4:
                cycle.states.state4,

              heatInputJPerKg:
                inputState.heatInputJPerKg,

              compressionRatio:
                inputState.compressionRatio,

              gasProperties:
                cycle.gasProperties,
            },
          );

        expect(
          performance
            .energyBalanceResidualJPerKg,
        ).toBeCloseTo(
          0,
          12,
        );

        expect(
          performance
            .heatInputJPerKg -
            performance
              .heatRejectedJPerKg,
        ).toBeCloseTo(
          performance
            .netWorkJPerKg,
          10,
        );
      },
    );

    it(
      "makes the two independent efficiency calculations agree",
      () => {
        const {
          inputState,
          cycle,
        } =
          createReferenceCycle();

        const performance =
          calculateIdealOttoEnergyPerformance(
            {
              state1:
                cycle.states.state1,

              state4:
                cycle.states.state4,

              heatInputJPerKg:
                inputState.heatInputJPerKg,

              compressionRatio:
                inputState.compressionRatio,

              gasProperties:
                cycle.gasProperties,
            },
          );

        expect(
          performance
            .efficiencyResidual,
        ).toBeCloseTo(
          0,
          12,
        );
      },
    );

    it(
      "increases ideal efficiency when compression ratio increases",
      () => {
        const eta8 =
          calculateIdealOttoThermalEfficiencyFromCompressionRatio(
            8,
            1.4,
          );

        const eta10 =
          calculateIdealOttoThermalEfficiencyFromCompressionRatio(
            10,
            1.4,
          );

        expect(
          eta10,
        ).toBeGreaterThan(
          eta8,
        );
      },
    );

    it(
      "rejects invalid compression ratio and gamma",
      () => {
        expect(
          () =>
            calculateIdealOttoThermalEfficiencyFromCompressionRatio(
              1,
              1.4,
            ),
        ).toThrow(
          IdealOttoEnergyCalculationError,
        );

        expect(
          () =>
            calculateIdealOttoThermalEfficiencyFromCompressionRatio(
              8,
              1,
            ),
        ).toThrow(
          IdealOttoEnergyCalculationError,
        );
      },
    );

    it(
      "uses the approved reference cv consistently",
      () => {
        expect(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES
            .cvJPerKgK,
        ).toBeCloseTo(
          717.5,
          12,
        );
      },
    );
  },
);