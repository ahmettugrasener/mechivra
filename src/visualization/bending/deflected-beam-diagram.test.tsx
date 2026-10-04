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

import { DeflectedBeamDiagram } from "@/visualization/bending/deflected-beam-diagram";

afterEach(() => {
  cleanup();
});

const centeredCurve = [
  {
    xM:
      0,

    deflectionM:
      0,
  },

  {
    xM:
      1,

    deflectionM:
      -0.0006875,
  },

  {
    xM:
      2,

    deflectionM:
      -0.001,
  },

  {
    xM:
      3,

    deflectionM:
      -0.0006875,
  },

  {
    xM:
      4,

    deflectionM:
      0,
  },
] as const;

describe(
  "DeflectedBeamDiagram",
  () => {
    it(
      "renders the centered reference state",
      () => {
        render(
          <DeflectedBeamDiagram
            spanM={4}
            loadPositionM={2}
            maximumMomentPositionM={2}
            maximumDeflectionPositionM={2}
            maximumAbsoluteDeflectionMm={1}
            curvePoints={
              centeredCurve
            }
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Beam deflection curve",
            },
          ),
        ).toBeInTheDocument();

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

        expect(
          screen.getByTestId(
            "maximum-deflection-value",
          ),
        ).toHaveTextContent(
          "|δ|max = 1 mm",
        );
      },
    );

    it(
      "states explicitly that the visual deflection is exaggerated",
      () => {
        render(
          <DeflectedBeamDiagram
            spanM={4}
            loadPositionM={2}
            maximumMomentPositionM={2}
            maximumDeflectionPositionM={2}
            maximumAbsoluteDeflectionMm={1}
            curvePoints={
              centeredCurve
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            /görsel olarak büyütülmüş/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /normalize edilmiştir/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "can display different maximum moment and maximum deflection positions",
      () => {
        render(
          <DeflectedBeamDiagram
            spanM={4}
            loadPositionM={1}
            maximumMomentPositionM={1}
            maximumDeflectionPositionM={
              1.764
            }
            maximumAbsoluteDeflectionMm={
              0.699
            }
            curvePoints={[
              {
                xM:
                  0,

                deflectionM:
                  0,
              },

              {
                xM:
                  1,

                deflectionM:
                  -0.00065625,
              },

              {
                xM:
                  1.764,

                deflectionM:
                  -0.00069877,
              },

              {
                xM:
                  3,

                deflectionM:
                  -0.00040625,
              },

              {
                xM:
                  4,

                deflectionM:
                  0,
              },
            ]}
            locale="en"
          />,
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
      },
    );
  },
);