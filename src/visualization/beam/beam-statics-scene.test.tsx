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

import { BeamStaticsScene } from "@/visualization/beam/beam-statics-scene";

afterEach(() => {
  cleanup();
});

describe(
  "BeamStaticsScene",
  () => {
    it(
      "renders the beam, supports, load, and symmetric reactions",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={10}
            loadPositionM={2}
            leftReactionKN={5}
            rightReactionKN={5}
            locale="en"
            ariaLabel="Simply supported beam diagram"
          />,
        );

        expect(
          screen.getByRole(
            "img",
            {
              name:
                "Simply supported beam diagram",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "P = 10 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_A = 5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_B = 5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "a = 2 m",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "L = 4 m",
          ),
        ).toBeInTheDocument();

        expect(
          container.querySelector(
            '[data-testid="left-pin-support"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-testid="right-roller-support"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-reaction-ratio="0.5"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "moves the visual point load and redistributes reaction lines",
      () => {
        const {
          container,
          rerender,
        } = render(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={10}
            loadPositionM={2}
            leftReactionKN={5}
            rightReactionKN={5}
            locale="en"
            ariaLabel="Beam diagram"
          />,
        );

        expect(
          container.querySelector(
            '[data-load-position-ratio="0.5"]',
          ),
        ).not.toBeNull();

        rerender(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={10}
            loadPositionM={3}
            leftReactionKN={2.5}
            rightReactionKN={7.5}
            locale="en"
            ariaLabel="Beam diagram"
          />,
        );

        expect(
          container.querySelector(
            '[data-load-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "a = 3 m",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_A = 2.5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_B = 7.5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          container.querySelector(
            '[data-testid="left-reaction-arrow"][data-reaction-ratio="0.25"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-testid="right-reaction-arrow"][data-reaction-ratio="0.75"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "updates load and reaction labels when load magnitude changes",
      () => {
        const {
          rerender,
        } = render(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={10}
            loadPositionM={2}
            leftReactionKN={5}
            rightReactionKN={5}
            locale="en"
            ariaLabel="Beam diagram"
          />,
        );

        rerender(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={20}
            loadPositionM={2}
            leftReactionKN={10}
            rightReactionKN={10}
            locale="en"
            ariaLabel="Beam diagram"
          />,
        );

        expect(
          screen.getByText(
            "P = 20 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_A = 10 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_B = 10 kN",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "explains that reaction-line length is qualitative",
      () => {
        render(
          <BeamStaticsScene
            spanM={4}
            pointLoadKN={10}
            loadPositionM={2}
            leftReactionKN={5}
            rightReactionKN={5}
            locale="tr"
            ariaLabel="Kiriş şeması"
          />,
        );

        expect(
          screen.getByText(
            /Reaksiyon çizgilerinin uzunluğu göreli büyüklüğü gösterir/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);