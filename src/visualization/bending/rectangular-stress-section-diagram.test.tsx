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

import { RectangularStressSectionDiagram } from "@/visualization/bending/rectangular-stress-section-diagram";

afterEach(() => {
  cleanup();
});

describe(
  "RectangularStressSectionDiagram",
  () => {
    it(
      "renders the centered-reference stress state",
      () => {
        const {
          container,
        } = render(
          <RectangularStressSectionDiagram
            widthM={0.1}
            heightM={0.2}
            topStressMPa={-15}
            bottomStressMPa={15}
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Bending-stress distribution in a rectangular section",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "section-width-label",
          ),
        ).toHaveTextContent(
          "b = 100 mm",
        );

        expect(
          screen.getByTestId(
            "section-height-label",
          ),
        ).toHaveTextContent(
          "h = 200 mm",
        );

        expect(
          screen.getByTestId(
            "top-stress-label",
          ),
        ).toHaveTextContent(
          "−15 MPa",
        );

        expect(
          screen.getByTestId(
            "bottom-stress-label",
          ),
        ).toHaveTextContent(
          "+15 MPa",
        );

        expect(
          container.querySelector(
            '[data-top-stress-sign="compression"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-bottom-stress-sign="tension"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "renders the neutral axis explicitly",
      () => {
        render(
          <RectangularStressSectionDiagram
            widthM={0.1}
            heightM={0.2}
            topStressMPa={-15}
            bottomStressMPa={15}
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "neutral-axis",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Nötr eksen",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "σ = 0",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders Turkish compression and tension terminology",
      () => {
        render(
          <RectangularStressSectionDiagram
            widthM={0.1}
            heightM={0.2}
            topStressMPa={-11.25}
            bottomStressMPa={11.25}
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            "Basma",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Çekme",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "top-stress-label",
          ),
        ).toHaveTextContent(
          "−11,25 MPa",
        );

        expect(
          screen.getByTestId(
            "bottom-stress-label",
          ),
        ).toHaveTextContent(
          "+11,25 MPa",
        );
      },
    );

    it(
      "renders zero stress without negative zero",
      () => {
        render(
          <RectangularStressSectionDiagram
            widthM={0.1}
            heightM={0.2}
            topStressMPa={0}
            bottomStressMPa={0}
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "top-stress-label",
          ),
        ).toHaveTextContent(
          "0 MPa",
        );

        expect(
          screen.getByTestId(
            "bottom-stress-label",
          ),
        ).toHaveTextContent(
          "0 MPa",
        );

        expect(
          screen.queryByText(
            /−0 MPa/,
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);