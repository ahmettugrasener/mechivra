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

import {
  getInteractiveDefinition,
} from "@/content/interactives";

import { BeamStaticsPointLoadExplorer } from "@/features/learning/interactives/beam-statics-point-load-explorer";

afterEach(() => {
  cleanup();
});

function getStaticsInteractive() {
  const definition =
    getInteractiveDefinition(
      "activity-ssb-04",
    );

  if (
    !definition ||
    definition.kind !==
      "beam_statics_point_load_explorer"
  ) {
    throw new Error(
      "Expected beam statics interactive definition.",
    );
  }

  return definition;
}

describe(
  "BeamStaticsPointLoadExplorer",
  () => {
    it(
      "starts from one synchronized verified physical state",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsPointLoadExplorer
            definition={
              getStaticsInteractive()
            }
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "beam-statics-scene",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "shear-force-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-moment-diagram",
          ),
        ).toBeInTheDocument();

        expect(
          container.querySelector(
            '[data-sync-revision="0"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByTestId(
            "left-reaction-value",
          ),
        ).toHaveTextContent(
          "5 kN",
        );

        expect(
          screen.getByTestId(
            "right-reaction-value",
          ),
        ).toHaveTextContent(
          "5 kN",
        );

        expect(
          screen.getByTestId(
            "left-shear-label",
          ),
        ).toHaveTextContent(
          "+5 kN",
        );

        expect(
          screen.getByTestId(
            "right-shear-label",
          ),
        ).toHaveTextContent(
          "−5 kN",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "10 kN·m",
        );
      },
    );

    it(
      "synchronizes every representation after a load-position change",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsPointLoadExplorer
            definition={
              getStaticsInteractive()
            }
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Load position from the left",
            },
          ),
          {
            target: {
              value: "3",
            },
          },
        );

        expect(
          container.querySelectorAll(
            '[data-sync-revision="1"]',
          ).length,
        ).toBeGreaterThanOrEqual(
          3,
        );

        expect(
          container.querySelector(
            '[data-active-parameter="load_position"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-load-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-shear-load-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-moment-maximum-position-ratio="0.75"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByTestId(
            "left-reaction-value",
          ),
        ).toHaveTextContent(
          "2.5 kN",
        );

        expect(
          screen.getByTestId(
            "right-reaction-value",
          ),
        ).toHaveTextContent(
          "7.5 kN",
        );

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

        expect(
          screen.getByTestId(
            "synchronized-feedback",
          ),
        ).toHaveTextContent(
          /Load position changed/i,
        );
      },
    );

    it(
      "synchronizes every representation after a load-magnitude change",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsPointLoadExplorer
            definition={
              getStaticsInteractive()
            }
            locale="en"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Point load",
            },
          ),
          {
            target: {
              value: "20",
            },
          },
        );

        expect(
          container.querySelector(
            '[data-active-parameter="point_load"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "P = 20 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "left-reaction-value",
          ),
        ).toHaveTextContent(
          "10 kN",
        );

        expect(
          screen.getByTestId(
            "right-reaction-value",
          ),
        ).toHaveTextContent(
          "10 kN",
        );

        expect(
          screen.getByTestId(
            "left-shear-label",
          ),
        ).toHaveTextContent(
          "+10 kN",
        );

        expect(
          screen.getByTestId(
            "right-shear-label",
          ),
        ).toHaveTextContent(
          "−10 kN",
        );

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "20 kN·m",
        );

        expect(
          screen.getByTestId(
            "synchronized-feedback",
          ),
        ).toHaveTextContent(
          /Load magnitude changed/i,
        );
      },
    );

    it(
      "increments synchronization revision together with meaningful interaction count",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsPointLoadExplorer
            definition={
              getStaticsInteractive()
            }
            locale="en"
          />,
        );

        const slider =
          screen.getByRole(
            "slider",
            {
              name:
                "Load position from the left",
            },
          );

        fireEvent.change(
          slider,
          {
            target: {
              value: "2.5",
            },
          },
        );

        fireEvent.change(
          slider,
          {
            target: {
              value: "3",
            },
          },
        );

        expect(
          container.querySelector(
            '[data-interaction-count="2"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-sync-revision="2"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "renders synchronized feedback in Turkish",
      () => {
        render(
          <BeamStaticsPointLoadExplorer
            definition={
              getStaticsInteractive()
            }
            locale="tr"
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "slider",
            {
              name:
                "Yükün soldan konumu",
            },
          ),
          {
            target: {
              value: "3",
            },
          },
        );

        expect(
          screen.getByTestId(
            "synchronized-feedback",
          ),
        ).toHaveTextContent(
          /Yük konumu değişti/i,
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
          screen.getByRole(
            "heading",
            {
              level: 4,
              name:
                "Eğilme momenti diyagramı M(x)",
            },
          ),
        ).toBeInTheDocument();
      },
    );
  },
);