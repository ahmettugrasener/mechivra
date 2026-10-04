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

import { BendingConceptVisualizationPanel } from "@/features/learning/bending/bending-concept-visualization-panel";

afterEach(() => {
  cleanup();
});

describe(
  "BendingConceptVisualizationPanel",
  () => {
    it(
      "renders values produced by the verified Engineering Core",
      () => {
        render(
          <BendingConceptVisualizationPanel
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "bending-concept-moment",
          ),
        ).toHaveTextContent(
          "10 kN·m",
        );

        expect(
          screen.getByTestId(
            "bending-concept-maximum-stress",
          ),
        ).toHaveTextContent(
          "15 MPa",
        );

        expect(
          screen.getByTestId(
            "rectangular-stress-section-diagram",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the Turkish engineering interpretation",
      () => {
        render(
          <BendingConceptVisualizationPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Momentten kesit gerilmesine",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /üst lif basmadadır/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /alt lif çekmededir/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);