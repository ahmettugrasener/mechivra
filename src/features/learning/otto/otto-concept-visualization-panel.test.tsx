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

import { OttoConceptVisualizationPanel } from "@/features/learning/otto/otto-concept-visualization-panel";

afterEach(() => {
  cleanup();
});

describe(
  "OttoConceptVisualizationPanel",
  () => {
    it(
      "renders the verified reference cycle",
      () => {
        render(
          <OttoConceptVisualizationPanel
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-concept-compression-ratio",
          ),
        ).toHaveTextContent(
          "r = 8",
        );

        expect(
          screen.getByTestId(
            "otto-concept-heat-input",
          ),
        ).toHaveTextContent(
          "800 kJ/kg",
        );

        expect(
          screen.getByTestId(
            "otto-concept-efficiency",
          ),
        ).toHaveTextContent(
          "56.472 %",
        );
      },
    );

    it(
      "renders the reference state table",
      () => {
        render(
          <OttoConceptVisualizationPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-state-row-1",
          ),
        ).toHaveTextContent(
          "300",
        );

        expect(
          screen.getByTestId(
            "otto-state-row-2",
          ),
        ).toHaveTextContent(
          "689,219",
        );

        expect(
          screen.getByTestId(
            "otto-state-row-3",
          ),
        ).toHaveTextContent(
          "1.804,202",
        );

        expect(
          screen.getByTestId(
            "otto-state-row-4",
          ),
        ).toHaveTextContent(
          "785,324",
        );
      },
    );

    it(
      "renders both synchronized visualizations",
      () => {
        render(
          <OttoConceptVisualizationPanel
            locale="en"
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
      },
    );
  },
);