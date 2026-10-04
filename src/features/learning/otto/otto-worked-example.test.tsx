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

import { OttoWorkedExample } from "@/features/learning/otto/otto-worked-example";

afterEach(() => {
  cleanup();
});

describe(
  "OttoWorkedExample",
  () => {
    it(
      "renders six calculation steps",
      () => {
        const {
          container,
        } =
          render(
            <OttoWorkedExample
              locale="en"
            />,
          );

        expect(
          container.querySelectorAll(
            "[data-otto-worked-example-step]",
          ),
        ).toHaveLength(6);
      },
    );

    it(
      "renders verified reference values",
      () => {
        render(
          <OttoWorkedExample
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            /T₂ = 689,219 K/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /T₃ = 1.804,202 K/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /qout = 348,22 kJ\/kg/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /η = wnet\/qin = 56,472 %/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "states the model-validity limitation",
      () => {
        render(
          <OttoWorkedExample
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            /not validation of a real engine/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);