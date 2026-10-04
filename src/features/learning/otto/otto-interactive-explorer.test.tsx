import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { OttoInteractiveExplorer } from "@/features/learning/otto/otto-interactive-explorer";

afterEach(() => {
  cleanup();
});

describe(
  "OttoInteractiveExplorer",
  () => {
    it(
      "starts from the verified r8 qin800 reference state",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "compression-ratio-value",
          ),
        ).toHaveTextContent(
          "8",
        );

        expect(
          screen.getByTestId(
            "heat-input-value",
          ),
        ).toHaveTextContent(
          "800 kJ/kg",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-efficiency",
          ),
        ).toHaveTextContent(
          "56.472 %",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-state3-temperature",
          ),
        ).toHaveTextContent(
          "1,804.202 K",
        );
      },
    );

    it(
      "updates the whole cycle when compression ratio changes",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Compression ratio r",
            },
          ),
          {
            target: {
              value:
                "10",
            },
          },
        );

        expect(
          screen.getByTestId(
            "compression-ratio-value",
          ),
        ).toHaveTextContent(
          "10",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-efficiency",
          ),
        ).toHaveTextContent(
          "60.189 %",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-net-work",
          ),
        ).toHaveTextContent(
          "481.514 kJ/kg",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-interpretation",
          ),
        ).toHaveTextContent(
          /efficiency changes with r/i,
        );
      },
    );

    it(
      "changes qin-dependent results without changing ideal efficiency at fixed r",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Specific heat input qin",
            },
          ),
          {
            target: {
              value:
                "400",
            },
          },
        );

        expect(
          screen.getByTestId(
            "heat-input-value",
          ),
        ).toHaveTextContent(
          "400 kJ/kg",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-efficiency",
          ),
        ).toHaveTextContent(
          "56.472 %",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-net-work",
          ),
        ).toHaveTextContent(
          "225.89 kJ/kg",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-state3-temperature",
          ),
        ).toHaveTextContent(
          "1,246.71 K",
        );

        expect(
          screen.getByTestId(
            "otto-interactive-interpretation",
          ),
        ).toHaveTextContent(
          /ideal efficiency remains unchanged/i,
        );
      },
    );

    it(
      "marks the activity meaningful after a real interaction and keeps that state",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="en"
          />,
        );

        const explorer =
          screen.getByTestId(
            "otto-interactive-explorer",
          );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "false",
        );

        const slider =
          screen.getByRole(
            "slider",
            {
              name:
                "Compression ratio r",
            },
          );

        fireEvent.change(
          slider,
          {
            target: {
              value:
                "9",
            },
          },
        );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "true",
        );

        fireEvent.change(
          slider,
          {
            target: {
              value:
                "8",
            },
          },
        );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "true",
        );
      },
    );

    it(
      "keeps p-v and temperature visualizations synchronized",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "ideal-otto-pv-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "otto-temperature-state-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "otto-interactive-state-row-3",
          ),
        ).toHaveTextContent(
          "1.804,202",
        );
      },
    );

    it(
      "warns against a single-cause interpretation when both controls change",
      () => {
        render(
          <OttoInteractiveExplorer
            locale="tr"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Sıkıştırma oranı r",
            },
          ),
          {
            target: {
              value:
                "10",
            },
          },
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Özgül ısı girişi qin",
            },
          ),
          {
            target: {
              value:
                "600",
            },
          },
        );

        expect(
          screen.getByTestId(
            "otto-interactive-interpretation",
          ),
        ).toHaveTextContent(
          /İki girdiyi birden değiştirdin/i,
        );
      },
    );
  },
);