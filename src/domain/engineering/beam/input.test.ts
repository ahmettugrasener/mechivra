import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering";

describe(
  "Simply supported beam display input",
  () => {
    it(
      "converts kN and metres into canonical SI state",
      () => {
        const result =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 2,
                unit: "m",
              },
            },
          );

        expect(
          result.state,
        ).toMatchObject({
          spanM: 4,
          pointLoadN: 10_000,
          loadPositionM: 2,
        });
      },
    );

    it(
      "converts millimetres into canonical metres",
      () => {
        const result =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4000,
                unit: "mm",
              },

              pointLoad: {
                value: 10_000,
                unit: "N",
              },

              loadPosition: {
                value: 1000,
                unit: "mm",
              },
            },
          );

        expect(
          result.state,
        ).toMatchObject({
          spanM: 4,
          pointLoadN: 10_000,
          loadPositionM: 1,
        });
      },
    );

    it(
      "produces the same physical state from equivalent display units",
      () => {
        const metricA =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 1,
                unit: "m",
              },
            },
          );

        const metricB =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 400,
                unit: "cm",
              },

              pointLoad: {
                value: 10_000,
                unit: "N",
              },

              loadPosition: {
                value: 1000,
                unit: "mm",
              },
            },
          );

        expect(
          metricA.state,
        ).toEqual(
          metricB.state,
        );
      },
    );

    it(
      "rejects a display load located at the support after conversion",
      () => {
        const result =
          createSimplySupportedBeamStateFromDisplayInput(
            {
              span: {
                value: 4,
                unit: "m",
              },

              pointLoad: {
                value: 10,
                unit: "kN",
              },

              loadPosition: {
                value: 0,
                unit: "mm",
              },
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.field ===
              "loadPositionM",
          ),
        ).toBe(true);
      },
    );
  },
);