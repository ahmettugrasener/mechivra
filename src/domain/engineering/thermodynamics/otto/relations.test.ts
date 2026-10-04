import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import {
  IdealOttoProcessRelationError,
  calculateIdealGasSpecificVolumeM3PerKg,
  calculateIdealOttoState2,
  calculateIdealOttoState3,
  calculateIdealOttoState4,
  createIdealOttoState1,
} from "@/domain/engineering/thermodynamics/otto/relations";

describe(
  "Ideal Otto process relations",
  () => {
    it(
      "computes the report reference state 1 specific volume",
      () => {
        const specificVolume =
          calculateIdealGasSpecificVolumeM3PerKg(
            300,
            100_000,
            287,
          );

        expect(
          specificVolume,
        ).toBeCloseTo(
          0.861,
          12,
        );
      },
    );

    it(
      "computes the report reference state 2",
      () => {
        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        const state2 =
          calculateIdealOttoState2(
            state1,
            8,
            1.4,
          );

        expect(
          state2.temperatureK,
        ).toBeCloseTo(
          689.2190129982209,
          9,
        );

        expect(
          state2.pressurePa,
        ).toBeCloseTo(
          1_837_917.3679952559,
          6,
        );

        expect(
          state2.specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.107625,
          12,
        );
      },
    );

    it(
      "computes the report reference state 3 at constant volume",
      () => {
        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        const state2 =
          calculateIdealOttoState2(
            state1,
            8,
            1.4,
          );

        const state3 =
          calculateIdealOttoState3(
            state2,
            800_000,
            717.5,
          );

        expect(
          state3.temperatureK,
        ).toBeCloseTo(
          1804.2015913954333,
          9,
        );

        expect(
          state3.pressurePa,
        ).toBeCloseTo(
          4_811_204.243721155,
          5,
        );

        expect(
          state3.specificVolumeM3PerKg,
        ).toBeCloseTo(
          state2.specificVolumeM3PerKg,
          12,
        );
      },
    );

    it(
      "computes the report reference state 4",
      () => {
        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        const state2 =
          calculateIdealOttoState2(
            state1,
            8,
            1.4,
          );

        const state3 =
          calculateIdealOttoState3(
            state2,
            800_000,
            717.5,
          );

        const state4 =
          calculateIdealOttoState4(
            state3,
            8,
            1.4,
          );

        expect(
          state4.temperatureK,
        ).toBeCloseTo(
          785.3243558445291,
          9,
        );

        expect(
          state4.pressurePa,
        ).toBeCloseTo(
          261_774.7852815097,
          5,
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
      "preserves the two constant-volume process relationships",
      () => {
        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        const state2 =
          calculateIdealOttoState2(
            state1,
            8,
            1.4,
          );

        const state3 =
          calculateIdealOttoState3(
            state2,
            800_000,
            717.5,
          );

        const state4 =
          calculateIdealOttoState4(
            state3,
            8,
            1.4,
          );

        expect(
          state3.specificVolumeM3PerKg,
        ).toBeCloseTo(
          state2.specificVolumeM3PerKg,
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
      "preserves the requested compression ratio in specific volume",
      () => {
        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        const state2 =
          calculateIdealOttoState2(
            state1,
            8,
            1.4,
          );

        expect(
          state1.specificVolumeM3PerKg /
            state2.specificVolumeM3PerKg,
        ).toBeCloseTo(
          8,
          12,
        );
      },
    );

    it(
      "rejects invalid process inputs",
      () => {
        expect(
          () =>
            calculateIdealGasSpecificVolumeM3PerKg(
              0,
              100_000,
              287,
            ),
        ).toThrow(
          IdealOttoProcessRelationError,
        );

        const state1 =
          createIdealOttoState1(
            300,
            100_000,
            IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
          );

        expect(
          () =>
            calculateIdealOttoState2(
              state1,
              1,
              1.4,
            ),
        ).toThrow(
          IdealOttoProcessRelationError,
        );

        expect(
          () =>
            calculateIdealOttoState2(
              state1,
              8,
              1,
            ),
        ).toThrow(
          IdealOttoProcessRelationError,
        );
      },
    );
  },
);