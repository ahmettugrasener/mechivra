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

import { BendingInteractiveExplorer } from "@/features/learning/bending/bending-interactive-explorer";

afterEach(() => {
  cleanup();
});

describe(
  "BendingInteractiveExplorer",
  () => {
    it(
      "starts from the verified centered reference state",
      () => {
        render(
          <BendingInteractiveExplorer
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveTextContent(
          "10 kN·m",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-stress",
          ),
        ).toHaveTextContent(
          "15 MPa",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveTextContent(
          "1 mm",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-position-text",
          ),
        ).toHaveTextContent(
          "xM = 2 m",
        );

        expect(
          screen.getByTestId(
            "maximum-deflection-position-text",
          ),
        ).toHaveTextContent(
          "xδ = 2 m",
        );
      },
    );

    it(
      "changes only deflection when elastic modulus changes",
      () => {
        render(
          <BendingInteractiveExplorer
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Elastic modulus E",
            },
          ),
          {
            target: {
              value:
                "100",
            },
          },
        );

        expect(
          screen.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveTextContent(
          "10 kN·m",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-stress",
          ),
        ).toHaveTextContent(
          "15 MPa",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveTextContent(
          "2 mm",
        );
      },
    );

    it(
      "updates geometry, stress, and deflection when section height changes",
      () => {
        render(
          <BendingInteractiveExplorer
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Section height h",
            },
          ),
          {
            target: {
              value:
                "250",
            },
          },
        );

        expect(
          screen.getByTestId(
            "section-height-label",
          ),
        ).toHaveTextContent(
          "h = 250 mm",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-stress",
          ),
        ).toHaveTextContent(
          "9.6 MPa",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveTextContent(
          "0.512 mm",
        );
      },
    );

    it(
      "separates maximum moment and maximum deflection locations after moving the load",
      () => {
        render(
          <BendingInteractiveExplorer
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Load position from the left a",
            },
          ),
          {
            target: {
              value:
                "1",
            },
          },
        );

        expect(
          screen.getByTestId(
            "bending-interactive-moment",
          ),
        ).toHaveTextContent(
          "7.5 kN·m",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-position-text",
          ),
        ).toHaveTextContent(
          "xM = 1 m",
        );

        expect(
          screen.getByTestId(
            "maximum-deflection-position-text",
          ),
        ).toHaveTextContent(
          "xδ = 1.764 m",
        );

        expect(
          screen.getByTestId(
            "bending-interactive-deflection",
          ),
        ).toHaveTextContent(
          "0.699 mm",
        );
      },
    );

    it(
      "records meaningful synchronized interaction",
      () => {
        const {
          container,
        } = render(
          <BendingInteractiveExplorer
            locale="tr"
          />,
        );

        const explorer =
          container.querySelector(
            '[data-testid="bending-interactive-explorer"]',
          );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "false",
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Kesit genişliği b",
            },
          ),
          {
            target: {
              value:
                "120",
            },
          },
        );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-meaningful-interaction",
          "true",
        );

        expect(
          explorer,
        ).toHaveAttribute(
          "data-interaction-count",
          "1",
        );
      },
    );
  },
);