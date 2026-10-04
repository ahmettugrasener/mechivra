import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createIdealOttoInputState,
  createIdealOttoPvProcessCurves,
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto";

import { IdealOttoPvDiagram } from "@/visualization/thermodynamics/otto/ideal-otto-pv-diagram";

afterEach(() => {
  cleanup();
});

function createCurves() {
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
      "Expected valid input.",
    );
  }

  const result =
    evaluateIdealOttoCycle(
      input.state,
    );

  if (!result.values) {
    throw new Error(
      "Expected valid cycle.",
    );
  }

  return createIdealOttoPvProcessCurves(
    result.values.states,
    result.values
      .gasProperties
      .gamma,
  );
}

describe(
  "IdealOttoPvDiagram",
  () => {
    it(
      "renders all four process paths and state points",
      () => {
        const {
          container,
        } = render(
          <IdealOttoPvDiagram
            curves={
              createCurves()
            }
            locale="en"
          />,
        );

        expect(
          container.querySelectorAll(
            "[data-process-id]",
          ),
        ).toHaveLength(4);

        expect(
          container.querySelectorAll(
            "[data-state-id]",
          ),
        ).toHaveLength(4);
      },
    );

    it(
      "labels the diagram as p-v with specific volume",
      () => {
        render(
          <IdealOttoPvDiagram
            curves={
              createCurves()
            }
            locale="tr"
          />,
        );

        const diagram =
          screen.getByTestId(
            "ideal-otto-pv-diagram",
          );

        expect(
          diagram,
        ).toHaveTextContent(
          "Özgül hacim, v (m³/kg)",
        );

        expect(
          diagram,
        ).toHaveTextContent(
          "Basınç, p (kPa)",
        );

        expect(
          diagram,
        ).toHaveTextContent(
          "p–v diyagramıdır",
        );
      },
    );
  },
);