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

function getBendingConceptActivity() {
  const activity =
    getActivitiesForModule(
      "module-bending",
    ).find(
      (candidate) =>
        candidate.id ===
        "activity-bending-02",
    );

  if (!activity) {
    throw new Error(
      "Expected Bending concept activity.",
    );
  }

  return activity;
}

describe(
  "Bending concept integration",
  () => {
    it(
      "renders the scientific Bending content instead of the empty legacy content blocks",
      () => {
        render(
          <NarrativeActivityRenderer
            activity={
              getBendingConceptActivity()
            }
            locale="tr"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Dikdörtgen kesitte geometrinin rolü",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Elastisite modülü neden gerilmeyi değiştirmiyor/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders the Engineering-Core-backed cross-section visualization",
      () => {
        render(
          <NarrativeActivityRenderer
            activity={
              getBendingConceptActivity()
            }
            locale="en"
          />,
        );

        expect(
          screen.getByTestId(
            "bending-concept-visualization-panel",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByTestId(
            "bending-concept-maximum-stress",
          ),
        ).toHaveTextContent(
          "15 MPa",
        );
      },
    );
  },
);