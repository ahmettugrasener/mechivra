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

import { OttoTemperatureStateDiagram } from "@/visualization/thermodynamics/otto/otto-temperature-state-diagram";

afterEach(() => {
  cleanup();
});

describe(
  "OttoTemperatureStateDiagram",
  () => {
    it(
      "renders all four reference temperatures",
      () => {
        const {
          container,
        } = render(
          <OttoTemperatureStateDiagram
            temperaturesK={{
              state1:
                300,

              state2:
                689.219013,

              state3:
                1804.201591,

              state4:
                785.324356,
            }}
            locale="en"
          />,
        );

        expect(
          container.querySelectorAll(
            "[data-temperature-state]",
          ),
        ).toHaveLength(4);

        expect(
          screen.getByText(
            "300 K",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "1,804.202 K",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uses Turkish decimal formatting",
      () => {
        render(
          <OttoTemperatureStateDiagram
            temperaturesK={{
              state1:
                300,

              state2:
                689.219013,

              state3:
                1804.201591,

              state4:
                785.324356,
            }}
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            "689,219 K",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Mutlak sıcaklık, T (K)",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);