import {
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { OttoSummaryPanel } from "@/features/learning/otto/otto-summary-panel";

afterEach(() => {
  cleanup();
});

describe(
  "OttoSummaryPanel",
  () => {
    it(
      "renders assumptions, limitations, and interpretation guidance",
      () => {
        render(
          <OttoSummaryPanel
            locale="tr"
          />,
        );

        const panel =
          screen.getByTestId(
            "otto-summary-panel",
          );

        expect(
          within(
            panel,
          ).getByRole(
            "heading",
            {
              name:
                "Model varsayımları",
            },
          ),
        ).toBeInTheDocument();

        expect(
          within(
            panel,
          ).getByRole(
            "heading",
            {
              name:
                "Model sınırları",
            },
          ),
        ).toBeInTheDocument();

        expect(
          within(
            panel,
          ).getByRole(
            "heading",
            {
              name:
                "Sonuçları yorumlarken",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "states the ideal-versus-real distinction explicitly",
      () => {
        render(
          <OttoSummaryPanel
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Ideal cycle ≠ real engine",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /knock, material temperature, mechanical loading/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the approved MIT Otto source",
      () => {
        render(
          <OttoSummaryPanel
            locale="en"
          />,
        );

        const source =
          document.querySelector(
            '[data-source-id="source-mit-otto-cycle"]',
          );

        expect(
          source,
        ).not.toBeNull();

        expect(
          source,
        ).toHaveTextContent(
          "Thermodynamics Notes — The Otto Cycle",
        );

        expect(
          source,
        ).toHaveTextContent(
          "MIT Unified Engineering",
        );

        expect(
          source,
        ).toHaveTextContent(
          /Scientific reference only/i,
        );
      },
    );

    it(
      "does not present internal consistency as real-engine validation",
      () => {
        render(
          <OttoSummaryPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-summary-panel",
          ),
        ).toHaveTextContent(
          /gerçek motorun deneysel validasyonu değildir/i,
        );
      },
    );

    it(
      "does not invent a numerical high-temperature threshold",
      () => {
        render(
          <OttoSummaryPanel
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-summary-panel",
          ),
        ).toHaveTextContent(
          /uzman onaylı sayısal bir üst sıcaklık sınırı henüz kodlanmamıştır/i,
        );
      },
    );
  },
);