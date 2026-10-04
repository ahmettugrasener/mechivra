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

import {
  idealOttoReferenceCases,
  isWithinIdealOttoReferenceTolerance,
} from "@/reference/engineering/ideal-otto";

import type {
  IdealOttoReferenceStatePoint,
} from "@/reference/engineering/ideal-otto";

function expectWithinTolerance(
  actual:
    number,

  expected:
    number,

  tolerance: {
    readonly absolute:
      number;

    readonly relative:
      number;
  },
) {
  expect(
    isWithinIdealOttoReferenceTolerance(
      actual,
      expected,
      tolerance,
    ),
  ).toBe(true);
}

function verifyStatePoint(
  actual: {
    readonly temperatureK:
      number;

    readonly pressurePa:
      number;

    readonly specificVolumeM3PerKg:
      number;
  },

  expected:
    IdealOttoReferenceStatePoint,

  tolerances:
    (typeof idealOttoReferenceCases)[number]["tolerances"],
) {
  expectWithinTolerance(
    actual.temperatureK,
    expected.temperatureK,
    tolerances.temperatureK,
  );

  expectWithinTolerance(
    actual.pressurePa,
    expected.pressurePa,
    tolerances.pressurePa,
  );

  expectWithinTolerance(
    actual.specificVolumeM3PerKg,
    expected.specificVolumeM3PerKg,
    tolerances.specificVolumeM3PerKg,
  );
}

describe(
  "Ideal Otto independent reference verification",
  () => {
    for (
      const reference
      of idealOttoReferenceCases
    ) {
      it(
        `matches independent reference: ${reference.id}`,
        () => {
          const inputResult =
            createIdealOttoInputState(
              {
                compressionRatio:
                  reference.input
                    .compressionRatio,

                initialTemperatureK:
                  reference.input
                    .initialTemperatureK,

                initialPressurePa:
                  reference.input
                    .initialPressurePa,

                heatInputJPerKg:
                  reference.input
                    .heatInputJPerKg,
              },
            );

          expect(
            inputResult.issues,
          ).toEqual([]);

          if (
            !inputResult.state
          ) {
            throw new Error(
              `Reference input ${reference.id} was unexpectedly invalid.`,
            );
          }

          const result =
            evaluateIdealOttoCycle(
              inputResult.state,
            );

          expect(
            result.status,
          ).toBe(
            "valid",
          );

          if (
            !result.values
          ) {
            throw new Error(
              `Reference case ${reference.id} did not produce cycle values.`,
            );
          }

          const actual =
            result.values;

          const expected =
            reference.expected;

          const tolerances =
            reference.tolerances;

          expectWithinTolerance(
            actual.gasProperties
              .gasConstantJPerKgK,

            expected.gasProperties
              .gasConstantJPerKgK,

            tolerances
              .gasConstantJPerKgK,
          );

          expectWithinTolerance(
            actual.gasProperties
              .gamma,

            expected.gasProperties
              .gamma,

            tolerances.gamma,
          );

          expectWithinTolerance(
            actual.gasProperties
              .cvJPerKgK,

            expected.gasProperties
              .cvJPerKgK,

            tolerances
              .specificHeatJPerKgK,
          );

          expectWithinTolerance(
            actual.gasProperties
              .cpJPerKgK,

            expected.gasProperties
              .cpJPerKgK,

            tolerances
              .specificHeatJPerKgK,
          );

          verifyStatePoint(
            actual.states
              .state1,

            expected.states
              .state1,

            tolerances,
          );

          verifyStatePoint(
            actual.states
              .state2,

            expected.states
              .state2,

            tolerances,
          );

          verifyStatePoint(
            actual.states
              .state3,

            expected.states
              .state3,

            tolerances,
          );

          verifyStatePoint(
            actual.states
              .state4,

            expected.states
              .state4,

            tolerances,
          );

          expectWithinTolerance(
            actual.energy
              .heatInputJPerKg,

            expected.energy
              .heatInputJPerKg,

            tolerances
              .specificEnergyJPerKg,
          );

          expectWithinTolerance(
            actual.energy
              .heatRejectedJPerKg,

            expected.energy
              .heatRejectedJPerKg,

            tolerances
              .specificEnergyJPerKg,
          );

          expectWithinTolerance(
            actual.energy
              .netWorkJPerKg,

            expected.energy
              .netWorkJPerKg,

            tolerances
              .specificEnergyJPerKg,
          );

          expectWithinTolerance(
            actual.energy
              .thermalEfficiencyFromEnergyBalance,

            expected.energy
              .thermalEfficiencyFromEnergyBalance,

            tolerances
              .efficiency,
          );

          expectWithinTolerance(
            actual.energy
              .thermalEfficiencyFromCompressionRatio,

            expected.energy
              .thermalEfficiencyFromCompressionRatio,

            tolerances
              .efficiency,
          );

          expect(
            Math.abs(
              actual.energy
                .energyBalanceResidualJPerKg,
            ),
          ).toBeLessThanOrEqual(
            1e-7,
          );

          expect(
            Math.abs(
              actual.energy
                .efficiencyResidual,
            ),
          ).toBeLessThanOrEqual(
            1e-12,
          );

          expect(
            actual.processes.map(
              (process) =>
                process.kind,
            ),
          ).toEqual([
            "isentropic_compression",
            "constant_volume_heat_addition",
            "isentropic_expansion",
            "constant_volume_heat_rejection",
          ]);
        },
      );
    }
  },
);