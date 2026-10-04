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

import {
  getWorkedExampleDefinition,
} from "@/content/worked-examples";

import { BeamStaticsWorkedExample } from "@/features/learning/worked-examples/beam-statics-worked-example";

afterEach(() => {
  cleanup();
});

function getDefinition() {
  const definition =
    getWorkedExampleDefinition(
      "activity-ssb-02",
    );

  if (
    !definition ||
    definition.kind !==
      "beam_statics_worked_example"
  ) {
    throw new Error(
      "Expected Statics worked example definition.",
    );
  }

  return definition;
}

describe(
  "BeamStaticsWorkedExample",
  () => {
    it(
      "renders the independently verified eccentric-load example",
      () => {
        render(
          <BeamStaticsWorkedExample
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "beam-statics-worked-example",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_A = 7.5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "R_B = 2.5 kN",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "maximum-moment-label",
          ),
        ).toHaveTextContent(
          "7.5 kN·m",
        );
      },
    );

    it(
      "renders all seven solution steps",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsWorkedExample
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

        expect(
          container.querySelectorAll(
            "[data-worked-example-step]",
          ),
        ).toHaveLength(7);
      },
    );

    it(
      "renders Turkish worked-example content",
      () => {
        render(
          <BeamStaticsWorkedExample
            definition={
              getDefinition()
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              level: 3,
              name:
                "Çözümlü örnek: Merkez dışı noktasal yük",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Neden önce moment dengesi\?/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Hızlı mühendislik kontrolü/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders both shear and moment diagrams from the same engineering state",
      () => {
        const {
          container,
        } = render(
          <BeamStaticsWorkedExample
            definition={
              getDefinition()
            }
            locale="en"
          />,
        );

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
            '[data-shear-load-position-ratio="0.25"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-moment-maximum-position-ratio="0.25"]',
          ),
        ).not.toBeNull();
      },
    );
  },
);