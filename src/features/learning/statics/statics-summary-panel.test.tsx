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

import { StaticsSummaryPanel } from "@/features/learning/statics/statics-summary-panel";

afterEach(() => {
  cleanup();
});

describe(
  "StaticsSummaryPanel",
  () => {
    it(
      "renders capabilities, assumptions, limitations, and scientific source",
      () => {
        const {
          container,
        } = render(
          <StaticsSummaryPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Bu modülden sonra ne yapabilirsin?",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Model varsayımları",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Model sınırları",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Bilimsel kaynak",
            },
          ),
        ).toBeInTheDocument();

        expect(
          container.querySelector(
            '[data-source-id="source-mit-beam-displacements"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "renders the canonical source metadata from the source registry",
      () => {
        render(
          <StaticsSummaryPanel
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            "Beam Displacements",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "David Roylance",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /MIT OpenCourseWare/,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders explicit model limitations",
      () => {
        render(
          <StaticsSummaryPanel
            locale="en"
          />,
        );

        expect(
          screen.getByText(
            /Distributed loads, multiple point loads/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /stress, material behavior, and deflection/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /0 < a < L/,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "connects Statics to the Bending module conceptually",
      () => {
        render(
          <StaticsSummaryPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByText(
            /Mukavemet — Eğilme modülünde/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);