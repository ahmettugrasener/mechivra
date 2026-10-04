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

function getBendingSummaryActivity() {
  const activity =
    getActivitiesForModule(
      "module-bending",
    ).find(
      (candidate) =>
        candidate.id ===
        "activity-bending-06",
    );

  if (!activity) {
    throw new Error(
      "Expected Bending summary activity.",
    );
  }

  return activity;
}

describe(
  "Bending summary integration",
  () => {
    it(
      "renders the scientific summary content and the structured closure panel",
      () => {
        render(
          <NarrativeActivityRenderer
            activity={
              getBendingSummaryActivity()
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Eğilme davranışını tek zincirde düşün",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-summary-panel",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "keeps both Bending scientific sources visible at module closure",
      () => {
        const {
          container,
        } = render(
          <NarrativeActivityRenderer
            activity={
              getBendingSummaryActivity()
            }
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
      },
    );
  },
);