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

import { BendingSummaryPanel } from "@/features/learning/bending/bending-summary-panel";

afterEach(() => {
  cleanup();
});

describe(
  "BendingSummaryPanel",
  () => {
    it(
      "renders capabilities, assumptions, limitations, and interpretation rules",
      () => {
        render(
          <BendingSummaryPanel
            locale="tr"
          />,
        );

        const panel =
          screen.getByTestId(
            "bending-summary-panel",
          );

        expect(
          panel,
        ).toHaveTextContent(
          "Bu modülden sonra ne yapabilirsin?",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "Model varsayımları",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "Model sınırları",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "Sonuçları yorumlarken",
        );
      },
    );

    it(
      "makes excluded failure modes explicit",
      () => {
        render(
          <BendingSummaryPanel
            locale="tr"
          />,
        );

        const panel =
          screen.getByTestId(
            "bending-summary-panel",
          );

        expect(
          panel,
        ).toHaveTextContent(
          "Plastik davranış",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "Yorulma",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "Burkulma",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "yerel gerilme yığılmaları",
        );
      },
    );

    it(
      "does not convert a criterion result into a global safety verdict",
      () => {
        render(
          <BendingSummaryPanel
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "bending-summary-panel",
          ),
        ).toHaveTextContent(
          "does not establish that the beam is 'safe'",
        );
      },
    );

    it(
      "renders both scientific sources with traceable IDs",
      () => {
        const {
          container,
        } = render(
          <BendingSummaryPanel
            locale="en"
          />,
        );

        expect(
          container.querySelector(
            '[data-source-id="source-mit-mechanics-lecture-13"]',
          ),
        ).not.toBeNull();

        expect(
          container.querySelector(
            '[data-source-id="source-mit-beam-displacements"]',
          ),
        ).not.toBeNull();

        expect(
          screen.getByText(
            "3.11 Mechanics of Materials — Lecture 13",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Beam Displacements",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "states the special-case deflection limitation",
      () => {
        render(
          <BendingSummaryPanel
            locale="tr"
          />,
        );

        const panel =
          screen.getByTestId(
            "bending-summary-panel",
          );

        expect(
          panel,
        ).toHaveTextContent(
          "PL³/(48EI)",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "orta noktadan",
        );

        expect(
          panel,
        ).toHaveTextContent(
          "genel tek noktasal yük sehim çözümü",
        );
      },
    );

    it(
      "renders the English version",
      () => {
        render(
          <BendingSummaryPanel
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Use the bending model within its proper limits",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Scientific traceability",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);