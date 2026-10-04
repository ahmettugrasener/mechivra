import {
  describe,
  expect,
  it,
} from "vitest";

import {
  halfHeatInputReference,
  higherCompressionRatioReference,
  idealOttoReferenceCases,
  reportAppendixBReference,
} from "@/reference/engineering/ideal-otto/reference-cases";

describe(
  "Independent Ideal Otto reference cases",
  () => {
    it(
      "contains four uniquely identified reference cases",
      () => {
        expect(
          idealOttoReferenceCases,
        ).toHaveLength(4);

        const ids =
          idealOttoReferenceCases.map(
            (reference) =>
              reference.id,
          );

        expect(
          new Set(
            ids,
          ).size,
        ).toBe(
          ids.length,
        );
      },
    );

    it(
      "retains the report Appendix B reference values",
      () => {
        const reference =
          reportAppendixBReference;

        expect(
          reference.input
            .compressionRatio,
        ).toBe(8);

        expect(
          reference.expected
            .states.state1
            .temperatureK,
        ).toBeCloseTo(
          300,
          6,
        );

        expect(
          reference.expected
            .states.state2
            .temperatureK,
        ).toBeCloseTo(
          689.219013,
          6,
        );

        expect(
          reference.expected
            .states.state3
            .temperatureK,
        ).toBeCloseTo(
          1804.201591,
          6,
        );

        expect(
          reference.expected
            .states.state4
            .temperatureK,
        ).toBeCloseTo(
          785.324356,
          6,
        );

        expect(
          reference.expected
            .energy
            .heatRejectedJPerKg /
            1000,
        ).toBeCloseTo(
          348.220225,
          6,
        );

        expect(
          reference.expected
            .energy
            .netWorkJPerKg /
            1000,
        ).toBeCloseTo(
          451.779775,
          6,
        );

        expect(
          reference.expected
            .energy
            .thermalEfficiencyFromEnergyBalance,
        ).toBeCloseTo(
          0.5647247184,
          10,
        );
      },
    );

    it(
      "satisfies the ideal-gas relation at every stored state",
      () => {
        for (
          const reference
          of idealOttoReferenceCases
        ) {
          const R =
            reference.expected
              .gasProperties
              .gasConstantJPerKgK;

          for (
            const state
            of Object.values(
              reference.expected
                .states,
            )
          ) {
            expect(
              state.pressurePa *
                state.specificVolumeM3PerKg,
            ).toBeCloseTo(
              R *
                state.temperatureK,
              6,
            );
          }
        }
      },
    );

    it(
      "preserves compression ratio and constant-volume legs",
      () => {
        for (
          const reference
          of idealOttoReferenceCases
        ) {
          const {
            state1,
            state2,
            state3,
            state4,
          } =
            reference.expected.states;

          expect(
            state1.specificVolumeM3PerKg /
              state2.specificVolumeM3PerKg,
          ).toBeCloseTo(
            reference.input
              .compressionRatio,
            10,
          );

          expect(
            state2.specificVolumeM3PerKg,
          ).toBeCloseTo(
            state3.specificVolumeM3PerKg,
            12,
          );

          expect(
            state4.specificVolumeM3PerKg,
          ).toBeCloseTo(
            state1.specificVolumeM3PerKg,
            12,
          );
        }
      },
    );

    it(
      "closes the stored energy balances",
      () => {
        for (
          const reference
          of idealOttoReferenceCases
        ) {
          const energy =
            reference.expected
              .energy;

          expect(
            energy.heatInputJPerKg -
              energy.heatRejectedJPerKg,
          ).toBeCloseTo(
            energy.netWorkJPerKg,
            8,
          );

          expect(
            energy.netWorkJPerKg /
              energy.heatInputJPerKg,
          ).toBeCloseTo(
            energy
              .thermalEfficiencyFromEnergyBalance,
            12,
          );

          expect(
            energy
              .thermalEfficiencyFromEnergyBalance,
          ).toBeCloseTo(
            energy
              .thermalEfficiencyFromCompressionRatio,
            12,
          );
        }
      },
    );

    it(
      "shows qin scaling without changing ideal efficiency at fixed r and gamma",
      () => {
        expect(
          halfHeatInputReference
            .expected
            .energy
            .heatRejectedJPerKg,
        ).toBeCloseTo(
          reportAppendixBReference
            .expected
            .energy
            .heatRejectedJPerKg /
            2,
          8,
        );

        expect(
          halfHeatInputReference
            .expected
            .energy
            .netWorkJPerKg,
        ).toBeCloseTo(
          reportAppendixBReference
            .expected
            .energy
            .netWorkJPerKg /
            2,
          8,
        );

        expect(
          halfHeatInputReference
            .expected
            .energy
            .thermalEfficiencyFromEnergyBalance,
        ).toBeCloseTo(
          reportAppendixBReference
            .expected
            .energy
            .thermalEfficiencyFromEnergyBalance,
          12,
        );
      },
    );

    it(
      "shows higher ideal efficiency for the r10 reference",
      () => {
        expect(
          higherCompressionRatioReference
            .expected
            .energy
            .thermalEfficiencyFromCompressionRatio,
        ).toBeGreaterThan(
          reportAppendixBReference
            .expected
            .energy
            .thermalEfficiencyFromCompressionRatio,
        );
      },
    );
  },
);