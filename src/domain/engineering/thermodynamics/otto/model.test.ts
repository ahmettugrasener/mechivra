import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import {
  evaluateIdealOttoFourStateCycle,
} from "@/domain/engineering/thermodynamics/otto/model";

import {
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

function createReferenceInputState() {
  const result =
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
    !result.state
  ) {
    throw new Error(
      "Expected valid Ideal Otto reference state.",
    );
  }

  return result.state;
}

describe(
  "Ideal Otto four-state Engineering Core",
  () => {
    it(
      "reproduces all four report reference states",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        const {
          state1,
          state2,
          state3,
          state4,
        } =
          result.values.states;

        expect(
          state1.temperatureK,
        ).toBeCloseTo(
          300,
          10,
        );

        expect(
          state1.pressurePa,
        ).toBeCloseTo(
          100_000,
          6,
        );

        expect(
          state1.specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.861,
          12,
        );

        expect(
          state2.temperatureK,
        ).toBeCloseTo(
          689.2190129982209,
          8,
        );

        expect(
          state2.pressurePa,
        ).toBeCloseTo(
          1_837_917.3679952559,
          5,
        );

        expect(
          state2.specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.107625,
          12,
        );

        expect(
          state3.temperatureK,
        ).toBeCloseTo(
          1804.2015913954333,
          8,
        );

        expect(
          state3.pressurePa,
        ).toBeCloseTo(
          4_811_204.243721155,
          4,
        );

        expect(
          state3.specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.107625,
          12,
        );

        expect(
          state4.temperatureK,
        ).toBeCloseTo(
          785.3243558445291,
          8,
        );

        expect(
          state4.pressurePa,
        ).toBeCloseTo(
          261_774.7852815097,
          4,
        );

        expect(
          state4.specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.861,
          12,
        );
      },
    );

    it(
      "uses the verified constant-specific-heat air property set",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        expect(
          result.values
            .gasProperties,
        ).toEqual(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
        );
      },
    );

    it(
      "preserves ideal-gas consistency at every state",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        const R =
          result.values
            .gasProperties
            .gasConstantJPerKgK;

        for (
          const state
          of Object.values(
            result.values.states,
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
      },
    );

    it(
      "preserves the two constant-volume legs",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        const {
          state1,
          state2,
          state3,
          state4,
        } =
          result.values.states;

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
      },
    );

    it(
      "preserves the requested compression ratio",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        const {
          state1,
          state2,
          state3,
          state4,
        } =
          result.values.states;

        expect(
          state1.specificVolumeM3PerKg /
            state2.specificVolumeM3PerKg,
        ).toBeCloseTo(
          8,
          12,
        );

        expect(
          state4.specificVolumeM3PerKg /
            state3.specificVolumeM3PerKg,
        ).toBeCloseTo(
          8,
          12,
        );
      },
    );

    it(
      "closes state 4 pressure consistently with state 1 at equal specific volume",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        const {
          state1,
          state4,
        } =
          result.values.states;

        const closurePressurePa =
          state1.pressurePa *
          (
            state4.temperatureK /
            state1.temperatureK
          );

        expect(
          state4.pressurePa,
        ).toBeCloseTo(
          closurePressurePa,
          6,
        );
      },
    );

    it(
      "returns the four process definitions in physical sequence",
      () => {
        const result =
          evaluateIdealOttoFourStateCycle(
            createReferenceInputState(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid Ideal Otto cycle.",
          );
        }

        expect(
          result.values
            .processes
            .map(
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

    it(
      "higher compression ratio raises state-2 temperature and pressure and reduces state-2 volume",
      () => {
        const base =
          createReferenceInputState();

        const higherInputResult =
          createIdealOttoInputState(
            {
              compressionRatio:
                10,

              initialTemperatureK:
                base.initialTemperatureK,

              initialPressurePa:
                base.initialPressurePa,

              heatInputJPerKg:
                base.heatInputJPerKg,
            },
          );

        if (
          !higherInputResult.state
        ) {
          throw new Error(
            "Expected valid higher-compression input.",
          );
        }

        const baseResult =
          evaluateIdealOttoFourStateCycle(
            base,
          );

        const higherResult =
          evaluateIdealOttoFourStateCycle(
            higherInputResult.state,
          );

        if (
          !baseResult.values ||
          !higherResult.values
        ) {
          throw new Error(
            "Expected valid cycle results.",
          );
        }

        expect(
          higherResult.values
            .states.state2
            .temperatureK,
        ).toBeGreaterThan(
          baseResult.values
            .states.state2
            .temperatureK,
        );

        expect(
          higherResult.values
            .states.state2
            .pressurePa,
        ).toBeGreaterThan(
          baseResult.values
            .states.state2
            .pressurePa,
        );

        expect(
          higherResult.values
            .states.state2
            .specificVolumeM3PerKg,
        ).toBeLessThan(
          baseResult.values
            .states.state2
            .specificVolumeM3PerKg,
        );
      },
    );

    it(
      "higher heat input changes states 3 and 4 but leaves states 1 and 2 unchanged",
      () => {
        const baseInput =
          createReferenceInputState();

        const lowerHeatResult =
          createIdealOttoInputState(
            {
              compressionRatio:
                8,

              initialTemperatureK:
                300,

              initialPressurePa:
                100_000,

              heatInputJPerKg:
                400_000,
            },
          );

        if (
          !lowerHeatResult.state
        ) {
          throw new Error(
            "Expected valid lower-heat input.",
          );
        }

        const base =
          evaluateIdealOttoFourStateCycle(
            baseInput,
          );

        const lowerHeat =
          evaluateIdealOttoFourStateCycle(
            lowerHeatResult.state,
          );

        if (
          !base.values ||
          !lowerHeat.values
        ) {
          throw new Error(
            "Expected valid cycle results.",
          );
        }

        expect(
          lowerHeat.values
            .states.state1,
        ).toEqual(
          base.values
            .states.state1,
        );

        expect(
          lowerHeat.values
            .states.state2,
        ).toEqual(
          base.values
            .states.state2,
        );

        expect(
          lowerHeat.values
            .states.state3
            .temperatureK,
        ).toBeLessThan(
          base.values
            .states.state3
            .temperatureK,
        );

        expect(
          lowerHeat.values
            .states.state4
            .temperatureK,
        ).toBeLessThan(
          base.values
            .states.state4
            .temperatureK,
        );
      },
    );

    it(
      "rejects a forged invalid canonical state",
      () => {
        const forged = {
          ...createReferenceInputState(),

          compressionRatio:
            1,
        };

        const result =
          evaluateIdealOttoFourStateCycle(
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
          createReferenceInputState();

        const first =
          evaluateIdealOttoFourStateCycle(
            input,
          );

        const second =
          evaluateIdealOttoFourStateCycle(
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