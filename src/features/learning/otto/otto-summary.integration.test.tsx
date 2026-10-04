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
  getActivitiesForModule,
} from "@/content/registry";

import { NarrativeActivityRenderer } from "@/features/learning/renderers/narrative-activity-renderer";

afterEach(() => {
  cleanup();
});

describe(
  "Otto summary learning integration",
  () => {
    it(
      "renders activity-otto-06 with the complete summary panel",
      () => {
        const activity =
          getActivitiesForModule(
            "module-ideal-otto-cycle",
          ).find(
            (
              candidate,
            ) =>
              candidate.id ===
              "activity-otto-06",
          );

        if (
          !activity
        ) {
          throw new Error(
            "Missing activity-otto-06.",
          );
        }

        render(
          <NarrativeActivityRenderer
            activity={
              activity
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByTestId(
            "otto-summary-panel",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "İdeal modeli doğru sınırlar içinde yorumla",
            },
          ),
        ).toBeInTheDocument();

        expect(
          document.querySelector(
            '[data-source-id="source-mit-otto-cycle"]',
          ),
        ).not.toBeNull();
      },
    );

    it(
      "keeps the English summary technically equivalent",
      () => {
        const activity =
          getActivitiesForModule(
            "module-ideal-otto-cycle",
          ).find(
            (
              candidate,
            ) =>
              candidate.id ===
              "activity-otto-06",
          );

        if (
          !activity
        ) {
          throw new Error(
            "Missing activity-otto-06.",
          );
        }

        render(
          <NarrativeActivityRenderer
            activity={
              activity
            }
            locale="en"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Interpret the ideal model within its proper limits",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /The four ideal thermodynamic processes are not identical/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);