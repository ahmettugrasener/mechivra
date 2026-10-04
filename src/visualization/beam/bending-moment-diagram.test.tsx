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

import { BendingMomentDiagram } from "@/visualization/beam/bending-moment-diagram";

afterEach(() => {
  cleanup();
});

describe(
  "BendingMomentDiagram",
  () => {
    it(
      "renders the verified centered-load moment diagram",
      () => {
        const {
          container,
        } = render(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={10}
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Bending-moment diagram M(x)",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "Mmax = 10 kN·m",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-position-label",
          ),
        ).toHaveTextContent(
          "x = 2 m",
        );

        expect(
          container.querySelector(
            '[data-moment-maximum-position-ratio="0.5"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "moves the maximum-moment point when the load moves right",
      () => {
        const {
          container,
          rerender,
        } = render(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={10}
            locale="en"
          />,
        );

        rerender(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={3}
            maximumMomentKNm={7.5}
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            '[data-moment-maximum-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "7.5 kN·m",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-position-label",
          ),
        ).toHaveTextContent(
          "x = 3 m",
        );
      },
    );

    it(
      "updates the numerical maximum moment when load magnitude changes",
      () => {
        const {
          rerender,
        } = render(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={10}
            locale="en"
          />,
        );

        rerender(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={20}
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "Mmax = 20 kN·m",
        );
      },
    );

    it(
      "renders a zero moment state",
      () => {
        render(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={0}
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "Mmax = 0 kN·m",
        );
      },
    );

    it(
      "renders localized Turkish title and explanation",
      () => {
        render(
          <BendingMomentDiagram
            spanM={4}
            maximumMomentPositionM={2}
            maximumMomentKNm={10}
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 4,
              name:
                "Eğilme momenti diyagramı M(x)",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Eğilme momenti diyagramı M(x)",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /moment mesnetlerde sıfırdır/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);