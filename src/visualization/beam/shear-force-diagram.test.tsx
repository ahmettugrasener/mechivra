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

import { ShearForceDiagram } from "@/visualization/beam/shear-force-diagram";

afterEach(() => {
  cleanup();
});

describe(
  "ShearForceDiagram",
  () => {
    it(
      "renders the verified centered-load shear diagram",
      () => {
        const {
          container,
        } = render(
          <ShearForceDiagram
            spanM={4}
            loadPositionM={2}
            leftShearKN={5}
            rightShearKN={-5}
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Shear-force diagram V(x)",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "left-shear-label",
          ),
        ).toHaveTextContent(
          "V = +5 kN",
        );

        expect(
          screen.getByTestId(
            "right-shear-label",
          ),
        ).toHaveTextContent(
          "V = −5 kN",
        );

        expect(
          container.querySelector(
            '[data-shear-load-position-ratio="0.5"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "moves the discontinuity when the point load moves",
      () => {
        const {
          container,
          rerender,
        } = render(
          <ShearForceDiagram
            spanM={4}
            loadPositionM={2}
            leftShearKN={5}
            rightShearKN={-5}
            locale="en"
          />,
        );

        rerender(
          <ShearForceDiagram
            spanM={4}
            loadPositionM={3}
            leftShearKN={2.5}
            rightShearKN={-7.5}
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            '[data-shear-load-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "x = 3 m",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "left-shear-label",
          ),
        ).toHaveTextContent(
          "+2.5 kN",
        );

        expect(
          screen.getByTestId(
            "right-shear-label",
          ),
        ).toHaveTextContent(
          "−7.5 kN",
        );
      },
    );

    it(
      "renders a zero-load shear state without negative zero",
      () => {
        render(
          <ShearForceDiagram
            spanM={4}
            loadPositionM={2}
            leftShearKN={0}
            rightShearKN={0}
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "left-shear-label",
          ),
        ).toHaveTextContent(
          "V = 0 kN",
        );

        expect(
          screen.getByTestId(
            "right-shear-label",
          ),
        ).toHaveTextContent(
          "V = 0 kN",
        );

        expect(
          screen.queryByText(
            /−0/,
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "renders the Turkish diagram title and explanation",
      () => {
        render(
          <ShearForceDiagram
            spanM={4}
            loadPositionM={2}
            leftShearKN={5}
            rightShearKN={-5}
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 4,
              name:
                "Kesme kuvveti diyagramı V(x)",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Pozitif değerler sıfır ekseninin üzerinde/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Kesme kuvveti diyagramı V(x)",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);