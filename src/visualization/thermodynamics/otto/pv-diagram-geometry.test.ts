import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createIdealOttoPvProcessCurves,
  evaluateIdealOttoCycle,
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto";

import {
  createIdealOttoPvDiagramGeometry,
} from "@/visualization/thermodynamics/otto/pv-diagram-geometry";

function createGeometry() {
  const input =
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

  if (!input.state) {
    throw new Error(
      "Expected valid Otto input.",
    );
  }

  const result =
    evaluateIdealOttoCycle(
      input.state,
    );

  if (!result.values) {
    throw new Error(
      "Expected valid Otto result.",
    );
  }

  const curves =
    createIdealOttoPvProcessCurves(
      result.values.states,
      result.values
        .gasProperties
        .gamma,
    );

  return createIdealOttoPvDiagramGeometry(
    curves,
  );
}

describe(
  "Ideal Otto p-v diagram geometry",
  () => {
    it(
      "maps four process curves",
      () => {
        const geometry =
          createGeometry();

        expect(
          geometry.curves,
        ).toHaveLength(4);
      },
    );

    it(
      "places equal-volume states on the same x coordinate",
      () => {
        const geometry =
          createGeometry();

        expect(
          geometry.states
            .state2.x,
        ).toBeCloseTo(
          geometry.states
            .state3.x,
          10,
        );

        expect(
          geometry.states
            .state1.x,
        ).toBeCloseTo(
          geometry.states
            .state4.x,
          10,
        );
      },
    );

    it(
      "places the highest-pressure state highest in the chart",
      () => {
        const geometry =
          createGeometry();

        expect(
          geometry.states
            .state3.y,
        ).toBeLessThan(
          geometry.states
            .state2.y,
        );

        expect(
          geometry.states
            .state3.y,
        ).toBeLessThan(
          geometry.states
            .state4.y,
        );
      },
    );

    it(
      "retains the physical state values",
      () => {
        const geometry =
          createGeometry();

        expect(
          geometry.states
            .state1
            .physical
            .specificVolumeM3PerKg,
        ).toBeCloseTo(
          0.861,
          12,
        );

        expect(
          geometry.states
            .state3
            .physical
            .pressurePa,
        ).toBeCloseTo(
          4_811_204.243721155,
          4,
        );
      },
    );
  },
);