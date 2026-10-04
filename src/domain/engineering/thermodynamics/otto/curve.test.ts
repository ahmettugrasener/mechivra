import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createIdealOttoPvProcessCurves,
} from "@/domain/engineering/thermodynamics/otto/curve";

import {
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto/analysis";

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
      "Expected valid Otto input.",
    );
  }

  const result =
    evaluateIdealOttoCycle(
      inputResult.state,
    );

  if (
    !result.values
  ) {
    throw new Error(
      "Expected valid Otto cycle.",
    );
  }

  return result.values;
}

describe(
  "Ideal Otto p-v process curves",
  () => {
    it(
      "creates all four process curves in cycle order",
      () => {
        const cycle =
          createReferenceCycle();

        const curves =
          createIdealOttoPvProcessCurves(
            cycle.states,
            cycle
              .gasProperties
              .gamma,
          );

        expect(
          curves.map(
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

    it(
      "uses the actual state points as process endpoints",
      () => {
        const cycle =
          createReferenceCycle();

        const curves =
          createIdealOttoPvProcessCurves(
            cycle.states,
            cycle
              .gasProperties
              .gamma,
          );

        expect(
          curves[0]
            ?.points[0],
        ).toEqual({
          specificVolumeM3PerKg:
            cycle.states
              .state1
              .specificVolumeM3PerKg,

          pressurePa:
            cycle.states
              .state1
              .pressurePa,
        });

        expect(
          curves[0]
            ?.points.at(
              -1,
            ),
        ).toEqual({
          specificVolumeM3PerKg:
            cycle.states
              .state2
              .specificVolumeM3PerKg,

          pressurePa:
            cycle.states
              .state2
              .pressurePa,
        });
      },
    );

    it(
      "preserves p-v-gamma invariant on both isentropic curves",
      () => {
        const cycle =
          createReferenceCycle();

        const gamma =
          cycle
            .gasProperties
            .gamma;

        const curves =
          createIdealOttoPvProcessCurves(
            cycle.states,
            gamma,
          );

        for (
          const curve
          of [
            curves[0],
            curves[2],
          ]
        ) {
          if (!curve) {
            throw new Error(
              "Missing isentropic curve.",
            );
          }

          const first =
            curve.points[0];

          if (!first) {
            throw new Error(
              "Missing first curve point.",
            );
          }

          const referenceInvariant =
            first.pressurePa *
            (
              first
                .specificVolumeM3PerKg **
              gamma
            );

          for (
            const point
            of curve.points
          ) {
            expect(
              point.pressurePa *
                (
                  point
                    .specificVolumeM3PerKg **
                  gamma
                ),
            ).toBeCloseTo(
              referenceInvariant,
              6,
            );
          }
        }
      },
    );

    it(
      "keeps processes 2-3 and 4-1 at constant specific volume",
      () => {
        const cycle =
          createReferenceCycle();

        const curves =
          createIdealOttoPvProcessCurves(
            cycle.states,
            cycle
              .gasProperties
              .gamma,
          );

        for (
          const curve
          of [
            curves[1],
            curves[3],
          ]
        ) {
          if (!curve) {
            throw new Error(
              "Missing constant-volume curve.",
            );
          }

          expect(
            curve.points[0]
              ?.specificVolumeM3PerKg,
          ).toBeCloseTo(
            curve.points[1]
              ?.specificVolumeM3PerKg ??
              Number.NaN,
            12,
          );
        }
      },
    );

    it(
      "rejects invalid gamma and sample counts",
      () => {
        const cycle =
          createReferenceCycle();

        expect(
          () =>
            createIdealOttoPvProcessCurves(
              cycle.states,
              1,
            ),
        ).toThrow();

        expect(
          () =>
            createIdealOttoPvProcessCurves(
              cycle.states,
              1.4,
              1,
            ),
        ).toThrow();
      },
    );
  },
);